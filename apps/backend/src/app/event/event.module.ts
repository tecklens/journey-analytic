import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {ScyllaModule} from "../scylla/scylla.module";

@Module({
  imports: [ScyllaModule],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
