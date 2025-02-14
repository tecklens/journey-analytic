import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsOptional} from "class-validator";

export class StatWebsiteDto {
  @ApiProperty()
  @IsDefined()
  start: Date;
  @ApiPropertyOptional()
  @IsOptional()
  end?: Date;
}