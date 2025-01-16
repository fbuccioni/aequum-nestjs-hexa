import { Injectable } from '@nestjs/common';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../dtos';

import { ExampleRepository } from '../../infrastructure/database/repositories/example.repository';
import { Example } from '../../infrastructure/database/schemas/example.schema';

import { BaseCRUDLMongooseService } from '../../shared/common/services/base-crudl-mongoose.service';


@Injectable()
export class ExamplesService extends BaseCRUDLMongooseService<
    Example,
    ExampleDto,
    ExampleCreateDto,
    ExampleUpdateDto
> {
    constructor(protected readonly repository: ExampleRepository) {
        super();
    }
}


