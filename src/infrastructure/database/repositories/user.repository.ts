import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '@aequum/typeorm/repositories';

import { User } from "../entities/user.entity";


@Injectable()
export class UserRepository extends TypeORMRepository<User> {

}