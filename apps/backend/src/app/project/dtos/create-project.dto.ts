import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsArray, IsDefined, IsOptional, IsString} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website: string;
  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags: string[];
}
