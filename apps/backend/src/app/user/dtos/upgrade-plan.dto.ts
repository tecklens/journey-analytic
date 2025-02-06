import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class UpgradePlanDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  userId: string;
  @ApiProperty()
  @IsInt()
  @IsDefined()
  plan: number;
}
