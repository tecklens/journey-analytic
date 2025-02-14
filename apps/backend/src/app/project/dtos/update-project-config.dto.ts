import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsArray, IsDefined, IsOptional, IsString} from 'class-validator';

export class UpdateProjectConfigDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  status: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  users: string[];
}
