import { ApiProperty } from '@nestjs/swagger';

import { Example } from '../../domain/models/example.model';


export class ExampleDto extends Example {
    @ApiProperty( { description: 'Identified of the example' } )
    _id: string;

    @ApiProperty( { description: 'Name of the example person' } )
    name: string;

    @ApiProperty( { description: "Age of the example person" } )
    age: number;

    @ApiProperty( { description: "Email of the example person" } )
    email: string;
}
