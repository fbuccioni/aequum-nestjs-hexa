import { Injectable } from '@nestjs/common';
import { BaseCRUDLMongooseService } from '@aequum/mongoose/services';

import { ExampleRepository } from '../../infrastructure/database/repositories/example.repository';
import { Example } from '../../infrastructure/database/schemas/example.schema';
import { ExampleDto } from '../dtos/example.dto';
import { ExampleUpdateDto } from '../dtos/example-update.dto';
import { ExampleCreateDto } from '../dtos/example-create.dto';


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


