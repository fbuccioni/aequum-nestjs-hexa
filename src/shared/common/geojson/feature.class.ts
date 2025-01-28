import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { IsNumberOrString } from '../validators/is-number-or-string.validator';
import {
    GeometryCollection,
    LineString,
    MultiLineString,
    MultiPoint,
    MultiPolygon,
    Point,
    Polygon,
} from './geometries';


export class Feature {
    @IsEnum(['Feature'])
    type: 'Feature';

    @ValidateNested()
    geometry: (
        Polygon
        | MultiPolygon
        | Point
        | MultiPoint
        | LineString
        | MultiLineString
        | GeometryCollection
    );

    @IsOptional()
    @IsNumberOrString()
    id?: string | number;

    @IsObject()
    @IsOptional()
    properties?: Record<string, string>;
}
