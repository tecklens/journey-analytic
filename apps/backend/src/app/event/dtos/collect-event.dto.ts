import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsDefined, IsOptional, IsString} from "class-validator";
import {OriginalEventDto} from "./original-event.dto";

export class CollectEventDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  sessionId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  websiteId: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  events: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  oE: OriginalEventDto[];
}