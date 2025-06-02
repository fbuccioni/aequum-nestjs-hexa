import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCRUDLTypeORMService } from '@aequum/typeorm/services';

import { ExampleRepository } from '../../infrastructure/database/repositories/example.repository';
import { Example } from '../../infrastructure/database/entities';
import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../dtos';


@Injectable()
export class ExamplesService extends BaseCRUDLTypeORMService<
    Example,
    ExampleCreateDto,
    ExampleUpdateDto,
    ExampleDto
>{
    constructor(
        @InjectRepository(Example)
        protected readonly repository: ExampleRepository
    ) {
        super();
    }
}
