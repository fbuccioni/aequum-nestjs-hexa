import { IsEnum } from 'class-validator';
import { IsCoordinate } from '../validators/is-coordinate.validator';


export class Point {
    @IsEnum(['Point'])
    type: 'Point' = 'Point';

    @IsCoordinate()
    coordinates: Coordinate;
}

