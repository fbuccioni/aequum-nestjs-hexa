import { Example } from 'src/domain/models/example.model';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class ExampleDto extends Example {
    @ApiProperty( { description: 'Identified of the example', format: "uuid" } )
    id: string;

    @ApiProperty( { description: 'Name of the example person' } )
    name: string;

    @ApiProperty( { description: "Age of the example person" } )
    age: number;

    @ApiProperty( { description: "Eamil of the example person" } )
    email: string;
}
