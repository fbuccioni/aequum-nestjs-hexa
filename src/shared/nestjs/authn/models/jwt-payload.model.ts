import { IsNotEmpty } from "class-validator";


export class JwtPayload {
    @IsNotEmpty()
    sub: string | number;

    @IsNotEmpty()
    exp: string | Date
}
