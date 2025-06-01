import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@aequum/nestjs-mongoose/pipes';
import { CRUDLController } from '@aequum/nestjs-crudl/controllers';

import { ExampleDto } from '../../../dtos/example.dto';
import { ExampleUpdateDto } from '../../../dtos/example-update.dto';
import { ExampleCreateDto } from '../../../dtos/example-create.dto';
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
            validationPipe: ParseObjectIdPipe,
        },
    }
) {
    constructor(public readonly service: ExamplesService) {
        super();
    }
}
