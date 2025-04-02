import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { GeometryCollection } from '../../../common/geojson/geometries';
import { PointDto } from './point.dto';
import { MultiPointDto } from './multi-point.dto';
import { LineStringDto } from './line-string.dto';
import { PolygonDto } from './polygon.dto';
import { MultiLineStringDto } from './multi-line-string.dto';
import { MultiPolygonDto } from './multi-polygon.dto';


export class GeometryCollectionDto extends GeometryCollection {
    @ApiProperty({
        example: 'GeometryCollection',
        description: 'The type of the GeoJSON object',
        enum: [ 'GeometryCollection' ]
    })
    type = 'GeometryCollection' as const;

    @ApiProperty({
        description: 'The geometries of the GeoJSON object',
        type: 'array',
        items: {
            oneOf: [
                { $ref: getSchemaPath(PointDto) },
                { $ref: getSchemaPath(MultiPointDto) },
                { $ref: getSchemaPath(LineStringDto) },
                { $ref: getSchemaPath(MultiLineStringDto) },
                { $ref: getSchemaPath(PolygonDto) },
                { $ref: getSchemaPath(MultiPolygonDto) },
                { $ref: getSchemaPath(GeometryCollectionDto) },
            ]
        },
    })
    geometries: Array<
        PointDto
        | MultiPointDto
        | LineStringDto
        | MultiLineStringDto
        | PolygonDto
        | MultiPolygonDto
        | GeometryCollectionDto
    >;
}
