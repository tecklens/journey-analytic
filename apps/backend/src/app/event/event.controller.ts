import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ClientIp, ExternalApiAccessible} from "../../types";
import {EventService} from "./event.service";
import {CollectEventDto} from "./dtos";
import {ApiKeyAuthGuard} from "../auth/strategy";
import {LogRequestSize} from "../../types/decorators/log-request-size.decorator";

@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}
    @Post('collects')
    @UseGuards(ApiKeyAuthGuard)
    @ExternalApiAccessible()
    @LogRequestSize()
    collectEventFromCustomer(@Body() payload: CollectEventDto, @ClientIp() ip: string) {
        return this.eventService.collectEventFromCustomer(payload, ip);
    }

    @Get('/session/:id')
    getEventBySession(@Param('id') id: string) {
        return this.eventService.getEventsBySession(id)
    }
}
