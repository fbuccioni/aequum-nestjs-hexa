import { OmitType } from '@nestjs/swagger';

import { ExampleDto } from './example.dto';


export class ExampleCreateDto extends OmitType(ExampleDto, ['_id'] as const) {}
