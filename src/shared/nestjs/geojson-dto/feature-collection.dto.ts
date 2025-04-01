import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { FeatureCollection } from '../../common/geojson/feature-collection.class';
import { FeatureDto } from './feature.dto';


export class FeatureCollectionDto extends FeatureCollection {
    @ApiProperty({
        example: 'FeatureCollection',
        description: 'The type of the GeoJSON object',
        enum: [ 'FeatureCollection' ]
    })
    type = 'FeatureCollection' as const;

    @ApiProperty({
        description: 'The features of the GeoJSON object',
        type: 'array',
        items: {
            $ref: getSchemaPath(FeatureDto)
        },
    })
    features: FeatureDto[];
}
