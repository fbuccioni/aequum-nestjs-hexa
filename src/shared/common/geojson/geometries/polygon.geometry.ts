import { IsArray, IsEnum } from 'class-validator';


export class Polygon {
    @IsEnum(['Polygon'])
    type: 'Polygon' = 'Polygon';

    @IsArray()
    coordinates: Coordinate[][];
}
