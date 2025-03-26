import * as mongoose from 'mongoose';
import 'mongoose-paginate-v2';

import { MongooseRepository } from "./mongoose.repository";
import { PaginateSortBy } from "../paginate-common/types/paginate-sort-by.type";
import { paginate } from "../paginate-mongoose/utils/paginate.util";


export class MongoosePaginatedRepository<SchemaModel>
extends MongooseRepository<SchemaModel> {
    protected override model: mongoose.PaginateModel<SchemaModel>;

    async findPaginated(
        filter: mongoose.RootFilterQuery<SchemaModel>,
        page: number,
        size: number,
        sort?: PaginateSortBy,
        projection?: mongoose.ProjectionType<SchemaModel>,
        options?: mongoose.PaginateOptions
    ) {
        return paginate(
            this.model,
            filter,
            page,
            size,
            sort,
            projection,
            options
        )
    }
}
