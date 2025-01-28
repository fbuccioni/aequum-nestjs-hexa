import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Feature } from '../../common/geojson/feature.class';
import {
    GeometryCollectionDto,
    LineStringDto,
    MultiLineStringDto,
    MultiPolygonDto,
    PointDto,
    PolygonDto,
} from './geometries';


export class FeatureDto extends Feature {
    @ApiProperty({
        example: 'Feature',
        description: 'The type of the GeoJSON object',
        enum: [ 'Feature' ]
    })
    type: 'Feature' = 'Feature';

    @ApiProperty({
        description: 'The identifier of the GeoJSON object',
        oneOf: [
            { type: 'string' },
            { type: 'number' }
        ],
        required: false
    })
    id?: string | number;

    @ApiProperty({
        description: 'The geometry of the GeoJSON object',
        oneOf: [
            { $ref: getSchemaPath(PolygonDto) },
            { $ref: getSchemaPath(MultiPolygonDto) },
            { $ref: getSchemaPath(PointDto) },
            { $ref: getSchemaPath(LineStringDto) },
            { $ref: getSchemaPath(MultiLineStringDto) },
            { $ref: getSchemaPath(GeometryCollectionDto) },
        ]
    })
    geometry:
        PolygonDto
        | MultiPolygonDto
        | PointDto
        | LineStringDto
        | MultiLineStringDto
        | GeometryCollectionDto
    ;


    @ApiProperty({
        description: 'The properties of the GeoJSON object',
        required: false
    })
    properties?: Record<string, string>;

}
