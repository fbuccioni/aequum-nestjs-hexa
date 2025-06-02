// noinspection ES6PreferShortImport

import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '@aequum/typeorm/repositories';

import { Example } from '../entities/example.entity';



@Injectable()
export class ExampleRepository extends TypeORMRepository<Example> {
    constructor(private dataSource: DataSource) {
        super(Example, dataSource);
    }
}
