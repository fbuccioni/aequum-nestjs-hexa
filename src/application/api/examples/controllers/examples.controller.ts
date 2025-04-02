import { Controller, ParseUUIDPipe, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
import { CRUDLController } from '../../../../shared/nestjs/crudl/controllers/crudl.controller';
import { ExamplesService } from '../../../services/examples.service';


@ApiTags('Example')
@Controller('examples')
export class ExamplesController extends CRUDLController(
    ExampleDto, [ ExampleDto ], ExampleCreateDto, ExampleUpdateDto, null, {
        name: {
            singular: 'example',
            plural: 'examples',
        },
        id: {
            type: 'string',
            validationPipe: ParseUUIDPipe,
        },
    }
) {
    constructor(protected readonly service: ExamplesService) { super(); }
}
