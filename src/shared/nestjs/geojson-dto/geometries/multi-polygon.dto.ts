import { ApiProperty } from '@nestjs/swagger';
import { MultiPolygon } from '../../../common/geojson/geometries';


export class MultiPolygonDto extends MultiPolygon {
    @ApiProperty({
        example: 'MultiPolygon',
        description: 'The type of the GeoJSON object',
        enum: [ 'MultiPolygon' ]
    })
    type: 'MultiPolygon' = 'MultiPolygon';

    @ApiProperty({
        description: 'The coordinates of the GeoJSON object',
        type: 'array',
        items: {
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
        },
    })
    coordinates: Coordinate[][][];
}
