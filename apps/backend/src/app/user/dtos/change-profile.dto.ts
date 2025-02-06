import { IsDefined, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeProfileDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  firstName: string;
  @ApiPropertyOptional()
  lastName: string;
  @ApiPropertyOptional()
  bio: string | undefined;
  @ApiPropertyOptional()
  urls: string[] | undefined;
}
