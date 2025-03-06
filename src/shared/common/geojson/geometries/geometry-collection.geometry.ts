import { IsEnum, ValidateNested } from 'class-validator';

import { MultiLineString } from './multi-line-string.geometry';
import { LineString } from './line-string.geometry';
import { Point } from './point.geometry';
import { MultiPolygon } from './multi-polygon.geometry';
import { Polygon } from './polygon.geometry';
import { MultiPoint } from './multi-point.geometry';


export class GeometryCollection {
    @IsEnum(['GeometryCollection'])
    type = 'GeometryCollection' as const;

    @ValidateNested({ each: true })
    geometries: Array<
        Polygon
        | MultiPolygon
        | Point
        | MultiPoint
        | LineString
        | MultiLineString
        | GeometryCollection
    >;
}
