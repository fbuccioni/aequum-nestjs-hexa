import { Exclude, Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsBoolean, IsString, IsUUID } from "class-validator";


export class User {
    @IsMongoId()
    @Type(() => IsUUID)
    id: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @Exclude()
    refreshToken: string[];

    @IsBoolean()
    @IsNotEmpty()
    enabled: boolean;
}
