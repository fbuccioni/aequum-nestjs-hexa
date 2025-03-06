import { ApiProperty } from '@nestjs/swagger';

import { MultiLineString } from '../../../common/geojson/geometries';


export class MultiLineStringDto extends MultiLineString {
    @ApiProperty({
        example: 'MultiLineString',
        description: 'The type of the GeoJSON object',
        enum: [ 'MultiLineString' ]
    })
    type = 'MultiLineString' as const;

    @ApiProperty({
        description: 'The coordinates of the GeoJSON object',
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'array',
                items: {
                    type: 'number'
                },
                minItems: 2
            }
        },
    })
    coordinates: Coordinate[][];
}
