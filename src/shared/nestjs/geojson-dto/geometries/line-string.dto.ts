import { ApiProperty } from '@nestjs/swagger';

import { LineString } from '../../../common/geojson/geometries';


export class LineStringDto extends LineString {
    @ApiProperty({
        example: 'LineString',
        description: 'The type of the GeoJSON object',
        enum: [ 'LineString' ]
    })
    type = 'LineString' as const;

    @ApiProperty({
        description: 'The coordinates of the GeoJSON object',
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'number'
            },
            minItems: 2
        }
    })
    coordinates: Coordinate[];
}
