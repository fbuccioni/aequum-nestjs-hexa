import { OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { UserDto } from "./user.dto";


export class UserRetrieveDto extends OmitType(UserDto, ['password'] as const) {
    @Exclude()
    password: string;
}
