import { PartialType } from '@nestjs/swagger';
import { ExampleCreateDto } from './exampleCreate.dto';


export class ExampleUpdateDto extends PartialType(ExampleCreateDto) {

}
