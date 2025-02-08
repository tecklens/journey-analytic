import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import maxmind, {CityResponse, Reader} from 'maxmind';
import {CollectEventDto} from "./dtos";
import {SnowflakeIdService} from "@street-devs/nest-snowflake-id";
import * as path from "path";
import * as orm from "express-cassandra";

@Injectable()
export class EventService implements OnModuleInit {
    private lookupGeo: Reader<CityResponse> | undefined = undefined;
    private eventRrWeb: any;

    constructor(
        @Inject('SCYLLA_CLIENT') private readonly scylla: orm.ScyllaClient,
        private readonly snowflakeIdService: SnowflakeIdService
    ) {
        this.eventRrWeb = this.scylla.instance.RrWebEvent;
    }

    async onModuleInit() {
        this.lookupGeo = await maxmind.open<CityResponse>(path.join(__dirname, 'assets', 'GeoLite2-Country.mmdb'));
    }

    async collectEventFromCustomer(payload: CollectEventDto, ip: string) {
        const r = new this.eventRrWeb({
            id: orm.datatypes.Long.fromString(this.snowflakeIdService.generate().toString()),
            sessionId: payload .sessionId,
            events: JSON.stringify(payload.events),
            time: { $db_function: 'toTimestamp(now())' },
        }).save(function(err: any){
            if(err) {
                Logger.error(JSON.stringify(err))
                return;
            }
            console.log('Yuppiie!');
        });
    }

    async getEventsBySession(id: string) {
        return this.eventRrWeb.findAsync({
            sessionId: id,
        })
    }
}
