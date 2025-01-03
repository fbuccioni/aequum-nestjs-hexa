import { Controller } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
import { Example } from '../../../../domain/models/example.model';
import { ExamplesService } from '../../../services/examples.service';
import { ParseObjectIdPipe } from 'src/shared/common/pipes/object-id.pipe';
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
            validationPipe: ParseObjectIdPipe,
        },
    }
) {
    constructor(protected readonly service: ExamplesService) {
        super();
    }
}
