import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Feature } from './feature.class';


export class FeatureCollection {
    @IsEnum(['FeatureCollection'])
    type: 'FeatureCollection' = 'FeatureCollection';

    @IsArray()
    @ValidateNested({ each: true })
    features: Feature[] = [];
}
