import { IsArray, IsEnum } from 'class-validator';

import { IsCoordinate } from '../validators/is-coordinate.validator';


export class LineString {
    @IsEnum(['LineString'])
    type = 'LineString' as const;

    @IsArray()
    @IsCoordinate({ each: true })
    coordinates: Coordinate[];
}
