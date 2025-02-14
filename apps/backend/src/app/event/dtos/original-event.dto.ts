import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {EventType} from "@journey-analytic/shared";

export class OriginalEventDto {
  @ApiProperty()
  @IsEnum(EventType)
  @IsDefined()
  event: EventType;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(36, {message: 'Max length event key is 36 characters'})
  @MinLength(2)
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  sessionId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  domain: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  screen: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referrer: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lang: string;

  @ApiProperty()
  @IsInt()
  @IsDefined()
  time: number;
}