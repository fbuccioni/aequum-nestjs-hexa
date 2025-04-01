import { ApiProperty } from '@nestjs/swagger';

import { MultiPoint } from '../../../common/geojson/geometries/multi-point.geometry';


export class MultiPointDto extends MultiPoint {
    @ApiProperty({
        example: 'MultiPoint',
        description: 'The type of the GeoJSON object',
        enum: [ 'MultiPoint' ]
    })
    type= 'MultiPoint' as const;

    @ApiProperty({
        description: 'The coordinates of the GeoJSON object',
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'number'
            },
            minItems: 2
        },
    })
    coordinates: Coordinate[];
}
