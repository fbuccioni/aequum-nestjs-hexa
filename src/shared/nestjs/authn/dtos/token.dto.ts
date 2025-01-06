import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class TokenDto {
    @ApiProperty({ description: 'Token (access)'})
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    refreshToken?: string;

    @ApiProperty({ description: 'Token expiration date', type: "string", format: 'date-time' })
    @IsNotEmpty()
    expiresAt: string | Date;
}
