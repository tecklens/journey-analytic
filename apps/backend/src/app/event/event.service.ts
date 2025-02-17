import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import maxmind, {CityResponse, Reader} from 'maxmind';
import {CollectEventDto} from "./dtos";
import {SnowflakeIdService} from "@street-devs/nest-snowflake-id";
import * as path from "path";
import * as orm from "express-cassandra";
import {CLIENT_CONFIG_CACHE_KEY, CLIENT_CONFIG_CACHE_TTL, EPOCH_TIME} from "../../consts";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";
import {ClientConfigDto} from "../project/dtos";
import {EventType, IJwtPayload} from "@journey-analytic/shared";
import {Cron} from "@nestjs/schedule";
import {HourlyStatsRepository, WebsiteRepository} from "../../repositories/maria";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import {has} from "lodash";

@Injectable()
export class EventService implements OnModuleInit {
  private lookupGeo: Reader<CityResponse> | undefined = undefined;
  private eventRrWeb: any;
  private originalEvent: any;

  constructor(
    @Inject('SCYLLA_CLIENT') private readonly scylla: orm.ScyllaClient,
    private readonly snowflakeIdService: SnowflakeIdService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly websiteRepository: WebsiteRepository,
    private readonly hourlyStatsRepository: HourlyStatsRepository,
    @InjectQueue('stat-event') private statEventQueue: Queue,
  ) {
    this.eventRrWeb = this.scylla.instance.RrWebEvent;
    this.originalEvent = this.scylla.instance.event;
  }

  async onModuleInit() {
    this.lookupGeo = await maxmind.open<CityResponse>(path.join(__dirname, 'assets', 'GeoLite2-Country.mmdb'));
  }

  async collectEventFromCustomer(u: IJwtPayload, payload: CollectEventDto, visitorId: string) {
    // * update ttl session
    const key = `${CLIENT_CONFIG_CACHE_KEY}_${visitorId}`;
    const config = await this.cacheManager.get<ClientConfigDto>(key)
    if (config) {
      await this.cacheManager.set(key, config, CLIENT_CONFIG_CACHE_TTL)
    }

    if (payload.oE) {
      const queries = []
      for (const ev of payload.oE) {
        const query = new this.originalEvent({
          id: orm.datatypes.Long.fromString(this.snowflakeIdService.generate().toString()),
          eventType: ev.event,
          eventKey: ev.key,
          projectId: u.projectId,
          websiteId: payload.websiteId,
          sessionId: payload.sessionId,
          data: JSON.stringify({
            domain: ev.domain,
            title: ev.title,
            screen: ev.screen,
            referrer: ev.referrer,
            lang: ev.lang,
          }),
          time: ev.time,
        }).save({return_query: true})

        queries.push(query)
      }

      this.scylla.doBatch(queries, function (err: any) {
        if (err) Logger.error(JSON.stringify(err))
      })
    }

    if (payload.events) {
      const r = new this.eventRrWeb({
        id: orm.datatypes.Long.fromString(this.snowflakeIdService.generate().toString()),
        sessionId: payload.sessionId,
        events: JSON.stringify(payload.events),
        time: {$db_function: 'toTimestamp(now())'},
      }).save(function (err: any) {
        if (err) {
          Logger.error(JSON.stringify(err))
          return;
        }
        Logger.debug('Done save events!');
      });
    }
  }

  async getEventsBySession(id: string) {
    return this.eventRrWeb.findAsync({
      sessionId: id,
    })
  }

  @Cron('0,15,30,45 * * * *')
  async statsEventEvery10Minutes() {
    const websites = await this.websiteRepository.findBy({});

    for (const website of websites) {
      const quarterPoint = this.calculateJobId();
      await this.statEventQueue.add('website', {
        websiteId: website.id,
        quarterPoint,
      }, {
        jobId: `${website.id}_${quarterPoint}`,
      })
    }
  }

  private calculateJobId(): number {
    const numMinutes = (new Date().getTime() - EPOCH_TIME) / (1000 * 60) //số phút từ thời điểm epoch
    return Math.floor(numMinutes / 15); // cứ 15p theo cron thì tính là 1 key
  }

  async calStatEventOfWebsite(websiteId: string, quarterPoint: number) {
    if (!websiteId || !quarterPoint) return;
    const events = await this.originalEvent.find({
      websiteId: websiteId,
      time: {
        '$gt': EPOCH_TIME + (quarterPoint * 15 * 60 * 1000),
        '$lt': EPOCH_TIME + ((quarterPoint + 1) * 15 * 60 * 1000)
      }
    })

    const groupByEvent: Record<string, number> = {}
    let views = 0;
    let visits = 0;
    if (events.length > 0) {
      for (const event of events) {
        if (!has(groupByEvent, event.eventType)) {
          groupByEvent[event.eventType] = 0;
        }

        groupByEvent[event.eventType] = groupByEvent[event.eventType] + 1;

        // cal views
        if (event.eventType === EventType.page_view) {
          views++;
        }

        if (event.eventType === EventType.session_start) {
          visits++;
        }
      }
    }

    await this.hourlyStatsRepository.save({
      websiteId: websiteId,
      pageViews: views,
      visitors: 0,
      visits: visits,
      quarterPoint,
    })
  }
}
