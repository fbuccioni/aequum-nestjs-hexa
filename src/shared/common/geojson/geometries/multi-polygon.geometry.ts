import { IsArray, IsEnum } from 'class-validator';


export class MultiPolygon {
    @IsEnum(['MultiPolygon'])
    type = 'MultiPolygon' as const;

    @IsArray()
    coordinates: Coordinate[][][];
}
