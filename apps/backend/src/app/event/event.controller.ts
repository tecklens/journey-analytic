import {Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Event')
@Controller('event')
export class EventController {
    @Post('collect')
    collectEventFromCustomer() {

    }
}
