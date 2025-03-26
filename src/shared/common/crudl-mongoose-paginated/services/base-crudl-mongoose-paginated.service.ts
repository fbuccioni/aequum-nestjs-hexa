import * as mongoose from 'mongoose';
import 'mongoose-paginate-v2';

import { PaginateSortBy } from '../../paginate-common/types/paginate-sort-by.type';
import { sortStringToPaginateSortBy } from '../../paginate-common/utils/sort-string-to-paginate-sort-by.type';
import { MongoosePaginatedRepository } from '../../repositories/mongoose-paginated.repository';
import { BaseCRUDLMongooseService } from '../../crudl-mongoose/services/base-crudl-mongoose.service';

/**
 * Base CRUDL Mongoose Service for a Mongoose Schema Model, with
 * paginated list output, by default assumes that the primary key
 * field as `id` provided by Virtual ID
 *
 * @paramType SchemaModel Mongoose Schema Model
 * @paramType SchemaModelDto DTO of the Mongoose Schema Model
 * @paramType SchemaModelCreateDto DTO to create a new Mongoose Schema Model
 * @paramType SchemaModelUpdateDto DTO to update a Mongoose Schema Model
 * @paramType PaginatedSchemaModelDto Paginated DTO of the Mongoose Schema Model
 * @paramType CustomFilterType Custom filter type to filter the query
 * @paramType PrimaryKeyField Primary key field of the Mongoose Schema
 * Model by default is `id` (Virtual ID)
 */
export class BaseCRUDLMongoosePaginatedService<
    SchemaModel extends { [key in PrimaryKeyField]: any },
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto,
    PaginatedSchemaModelDto,
    CustomFilterType = any,
    PrimaryKeyField extends string = 'id',
> extends BaseCRUDLMongooseService<
    SchemaModel,
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto,
    CustomFilterType,
    PrimaryKeyField
> {
    /** @inheritDoc */
    protected override readonly repository: MongoosePaginatedRepository<SchemaModel>

    /**
     * List all data entries paginated
     *
     * @param filter - Filter to apply to the query
     * @param page - Page number
     * @param size - Page size
     * @param sort - Sort options
     * @param projection - MongoDB projection
     * @param options - `mongoose-paginate-v2` options
     * @returns Paginated result
     *
     * @see [Options for `mongoose-paginate-v2`](https://github.com/aravindnc/mongoose-paginate-v2?tab=readme-ov-file#modelpaginatequery-options-callback)
     */
    async paginatedList(
        filter: CustomFilterType,
        page: number,
        size: number,
        sort?: string | PaginateSortBy,
        projection?: mongoose.ProjectionType<SchemaModel>,
        options?: mongoose.PaginateOptions
    ): Promise<PaginatedSchemaModelDto> {
        if (typeof sort === 'string')
            sort = sortStringToPaginateSortBy(sort);

        return this.repository.findPaginated(
            this.queryFilterToMongoDBFilter(filter),
            page,
            size,
            sort,
            projection,
            options
        ) as unknown as PaginatedSchemaModelDto;
    }
}
