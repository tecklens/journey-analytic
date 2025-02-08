import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class CollectEventDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  sessionId: string;
  events: any[];
}