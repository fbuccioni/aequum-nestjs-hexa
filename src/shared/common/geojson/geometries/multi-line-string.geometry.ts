import { IsArray, IsEnum } from 'class-validator';


export class MultiLineString {
    @IsEnum(['MultiLineString'])
    type = 'MultiLineString' as const;

    @IsArray()
    coordinates: Array<Coordinate[]>;
}
