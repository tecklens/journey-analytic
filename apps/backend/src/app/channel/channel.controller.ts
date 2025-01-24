import {Controller, Get, Post} from '@nestjs/common';
import {ChannelService} from "./channel.service";

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get('')
    findAll() {
        return this.channelService.findAll()
    }

    @Post('')
    create() {
        return this.channelService.createChannel('test')
    }
}
