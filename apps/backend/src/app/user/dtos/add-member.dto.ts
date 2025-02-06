import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsString } from 'class-validator';

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  staffEmail: string;

  @ApiProperty()
  @IsArray()
  @IsDefined()
  roles: string[];
}
