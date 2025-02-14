import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ExternalApiAccessible, UserSession} from "../../types";
import {EventService} from "./event.service";
import {CollectEventDto} from "./dtos";
import {ApiKeyAuthGuard} from "../auth/strategy";
import {LogRequestSize} from "../../types/decorators/log-request-size.decorator";
import {VisitorId} from "../../types/decorators/visitor.decorator";
import {IJwtPayload} from "@journey-analytic/shared";

@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}
    @Post('collects')
    @UseGuards(ApiKeyAuthGuard)
    @ExternalApiAccessible()
    @LogRequestSize()
    collectEventFromCustomer(
      @UserSession() user: IJwtPayload,
      @Body() payload: CollectEventDto,
      @VisitorId() visitorId: string,
    ) {
        return this.eventService.collectEventFromCustomer(user, payload, visitorId);
    }

    @Get('/session/:id')
    getEventBySession(@Param('id') id: string) {
        return this.eventService.getEventsBySession(id)
    }
}
