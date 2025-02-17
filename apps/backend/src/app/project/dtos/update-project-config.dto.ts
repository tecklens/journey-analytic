import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsArray, IsDefined, IsInt, IsOptional, IsString} from 'class-validator';

export class UpdateProjectConfigDto {
  @ApiProperty()
  @IsInt()
  @IsDefined()
  status: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  users: string[];
}
