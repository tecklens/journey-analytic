import {Processor, WorkerHost} from "@nestjs/bullmq";
import {Job} from "bullmq";
import {EventService} from "./event.service";

@Processor('stat-event')
export class StatEventConsumer extends WorkerHost {
  constructor(private readonly eventService: EventService) {
    super();
  }
  process(job: Job, token: string | undefined): Promise<any> {
    return this.eventService.calStatEventOfWebsite(job.data?.websiteId, job.data?.quarterPoint);
  }
}