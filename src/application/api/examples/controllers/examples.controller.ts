import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
import { ExamplesService } from '../../../services/examples.service';
import { ParseObjectIdPipe } from '../../../../shared/nestjs/common/pipes/object-id.pipe';
import { CRUDLController } from '../../../../shared/nestjs/crudl/controllers/crudl.controller';


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
            validationPipe: ParseObjectIdPipe,
        },
    }
) {
    constructor(protected readonly service: ExamplesService) {
        super();
    }
}
