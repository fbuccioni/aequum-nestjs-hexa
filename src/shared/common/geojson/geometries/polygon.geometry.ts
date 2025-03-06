import { IsArray, IsEnum } from 'class-validator';


export class Polygon {
    @IsEnum(['Polygon'])
    type = 'Polygon' as const;

    @IsArray()
    coordinates: Coordinate[][];
}
