import { IsArray, IsEnum } from 'class-validator';
import { IsCoordinate } from '../validators/is-coordinate.validator';

export class LineString {
    @IsEnum(['LineString'])
    type: 'LineString' = 'LineString';

    @IsArray()
    @IsCoordinate({ each: true })
    coordinates: Coordinate[];
}
