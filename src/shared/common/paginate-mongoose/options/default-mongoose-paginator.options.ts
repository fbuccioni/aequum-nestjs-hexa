import mongoose from "mongoose";
import 'mongoose-paginate-v2';


export const defaultMongoosePaginateOptions: mongoose.PaginateOptions = {
    customLabels: {
        totalDocs: 'total',
        docs: 'data',
        limit: 'size',
        page: 'page',
        nextPage: 'next',
        prevPage: 'prev',
        hasNextPage: '_',
        hasPrevPage: '_',
        totalPages: 'pages',
        pagingCounter: '_',
        meta: 'paginator',
    }
}
