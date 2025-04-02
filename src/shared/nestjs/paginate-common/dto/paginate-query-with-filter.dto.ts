import { ApiProperty } from "@nestjs/swagger";

import { PaginateRequest } from "../interfaces/paginate-request.interface";
import { ClassConstructor } from '../../../common/types/class-constructor.type';


/**
 * Class to create a DTO for pagination with a custom filter if needed.
 *
 * @param ModelFilterDto - Custom filter DTO class when have one
 * @example ```typescript
 * // Create with existing filter
 * class ModelQueryDto
 * extends PaginateQueryWithFilterDto(ModelFilterQueryDto) {
 *   // ...
 * }
 * ```
 * @example ```typescript
 * // Create the filter directly by extending the class
 * class ModelQueryDto extends PaginateQueryWithFilterDto() {
 *    @ApiProperty({ description: 'Name filter', required: false })
 *    nameIs?: string;
 * }
 * ```
 * @constructor
 */
export function PaginateQueryWithFilterDto(ModelFilterDto: ClassConstructor | null = null) {
    const ModelFilterDtoClass = ModelFilterDto ? ModelFilterDto : class {};

    class PaginateQueryWithFilterDto
    extends ModelFilterDtoClass
    implements PaginateRequest {
        @ApiProperty({ description: 'Page number', default: 1 })
        page: number;

        @ApiProperty({ description: 'Size of the page', default: 10 })
        size: number;

        @ApiProperty({ description: 'Sort by field', required: false, example: "field1 -field2" })
        sortBy?: string;
    }

    return PaginateQueryWithFilterDto;
}
