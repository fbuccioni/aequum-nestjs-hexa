import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


/**
 * Default token DTO
 */
export class TokenDto {
    @ApiProperty({ description: 'Access token'})
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({ description: 'Refresh token', required: false})
    @IsString()
    @IsNotEmpty()
    refreshToken?: string;

    @ApiProperty({ description: 'Token expiration date', type: "string", format: 'date-time' })
    @IsNotEmpty()
    expiresAt: string | Date;
}
