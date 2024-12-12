import { Injectable } from '@nestjs/common';
import { Example } from '../entities/example.entity';
import { TypeORMRepository } from '../../../../shared/common/repository/type-orm.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class ExampleRepository extends TypeORMRepository<Example> {
    constructor(private dataSource: DataSource) {
        super(Example, dataSource);
    }
}
