import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class TokenRefreshDto {
    @ApiProperty({ description: 'Token (refresh)'})
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    token: string
}
