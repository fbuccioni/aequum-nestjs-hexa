import { ApiProperty } from '@nestjs/swagger';

import { Example } from '../../domain/models/example.model';


export class ExampleDto extends Example {
    @ApiProperty({
        type: 'string', format: 'uuid',
        description: 'Unique identifier for the example',
        example: '60c72b2f9b1d8c001c8e4f5a',
    })
    id: string;
    
    @ApiProperty({
        type: 'string',
        description: 'Name of the example',
        example: 'Sample Example',
    })
    name: string;
    
    @ApiProperty({
        type: 'number',
        description: 'Age of the example',
        example: 5,
    })
    age: number;
    
    @ApiProperty({
        type: 'string',
        description: 'Breed of the example',
        example: 'Example Breed',
        required: false,
    })
    breed?: string;
}
