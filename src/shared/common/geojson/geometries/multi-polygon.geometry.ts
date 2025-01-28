import { IsArray, IsEnum } from 'class-validator';


export class MultiPolygon {
    @IsEnum(['MultiPolygon'])
    type: 'MultiPolygon' = 'MultiPolygon';

    @IsArray()
    coordinates: Coordinate[][][];
}
