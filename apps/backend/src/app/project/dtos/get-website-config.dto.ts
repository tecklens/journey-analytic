import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString} from "class-validator";

export class GetWebsiteConfigDto {
    @ApiProperty()
    @IsString()
    @IsDefined()
    domain: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    screen: string;
}