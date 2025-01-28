import { IsArray, IsEnum } from 'class-validator';


export class MultiLineString {
    @IsEnum(['MultiLineString'])
    type: 'MultiLineString' = 'MultiLineString';

    @IsArray()
    coordinates: Array<Coordinate[]>;
}
