import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


/**
 * Default login DTO
 */
export class LoginDto {
    @ApiProperty({ description: 'Username', minLength: 3 })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @ApiProperty({ description: 'Password', minLength: 3 })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password: string;
}
