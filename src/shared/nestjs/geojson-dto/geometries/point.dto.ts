import { ApiProperty } from '@nestjs/swagger';
import { Point } from '../../../common/geojson/geometries';


export class PointDto extends Point {
    @ApiProperty({
        example: 'Point',
        description: 'The type of the GeoJSON object',
        enum: [ 'Point' ]
    })
    type: 'Point' = 'Point';

    @ApiProperty({
        description: 'The coordinates of the GeoJSON object',
        type: 'array',
        items: {
            type: 'number'
        },
        minItems: 2
    })
    coordinates: Coordinate;
}
