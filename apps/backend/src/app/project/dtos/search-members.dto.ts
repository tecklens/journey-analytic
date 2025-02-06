import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {PaginationWithFiltersRequestDto} from "../../../types";

export class SearchMembersDto extends PaginationWithFiltersRequestDto({
  defaultLimit: 10,
  maxLimit: 100,
  queryDescription: 'It allows filtering.',
}) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email: string;
}
