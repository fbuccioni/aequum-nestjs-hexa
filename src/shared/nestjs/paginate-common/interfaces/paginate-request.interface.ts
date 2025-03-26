import { PaginateSortBy } from "../../../common/paginate-common/types/paginate-sort-by.type";


export interface PaginateRequest {
    page: number;
    size: number;
    sortBy?: string;
}
