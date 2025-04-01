import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { TypeORMRepository } from '../../../shared/common/repository/type-orm.repository';
import { Example } from '../entities/example.entity';



@Injectable()
export class ExampleRepository extends TypeORMRepository<Example> {
    constructor(private dataSource: DataSource) {
        super(Example, dataSource);
    }
}
