import {Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ClientIp} from "../../types/decorators";
import {EventService} from "./event.service";

@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}
    @Post('collect')
    collectEventFromCustomer(@ClientIp() ip: string) {
        return this.eventService.collectEventFromCustomer(ip);
    }
}
