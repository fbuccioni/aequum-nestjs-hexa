import { ApiProperty } from '@nestjs/swagger';
import { Polygon } from '../../../common/geojson/geometries';


export class PolygonDto extends Polygon {
    @ApiProperty({
        example: 'Polygon',
        description: 'The type of the GeoJSON object',
        enum: [ 'Polygon' ]
    })
    type: 'Polygon' = 'Polygon';

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
