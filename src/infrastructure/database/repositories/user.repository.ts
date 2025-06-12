import { Injectable } from '@nestjs/common';
import { TypeORMPaginatedRepository } from '@aequum/typeorm/repositories/paginated';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from "../entities/user.entity";


@Injectable()
export class UserRepository extends TypeORMPaginatedRepository<User> {
    constructor(@InjectDataSource() dataSource: DataSource) {
        super(User, dataSource)
    }
}