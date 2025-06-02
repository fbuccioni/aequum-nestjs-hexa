import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@aequum/nestjs-mongoose/pipes';
import { CRUDLController } from '@aequum/nestjs-crudl/controllers';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
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
    constructor(public override readonly service: ExamplesService) {
        super();
    }
}
