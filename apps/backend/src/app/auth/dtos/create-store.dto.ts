import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  field?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  limitStorage?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ownerOrg?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referralBy?: string;
}
