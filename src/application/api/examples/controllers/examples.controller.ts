import { Controller, ParseUUIDPipe, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
import { ExamplesService } from '../../../services/examples.service';
import { CRUDLController } from '../../../../shared/nestjs/common/controllers/crudl.controller';


@ApiTags('Example')
@Controller('examples')
export class ExamplesController extends CRUDLController(
    ExampleDto, ExampleCreateDto, ExampleUpdateDto, {
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
