import { ExampleDto } from './example.dto';
import { OmitType } from '@nestjs/swagger';


export class ExampleCreateDto extends OmitType(ExampleDto, ['_id'] as const) {

}
