import { ExampleDto } from './example.dto';
import { OmitType } from '@nestjs/swagger';


export class ExampleCreateDto extends OmitType(ExampleDto, ['id'] as const) {

}
