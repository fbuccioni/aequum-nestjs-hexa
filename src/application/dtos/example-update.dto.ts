import { PartialType } from '@nestjs/swagger';
import { ExampleCreateDto } from './example-create.dto';


export class ExampleUpdateDto extends PartialType(ExampleCreateDto) {

}
