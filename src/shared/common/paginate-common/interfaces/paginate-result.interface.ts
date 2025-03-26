export interface PaginateResult<T> {
    data: T[];
    paginator: {
        page: number;
        size: number;
        pages: number;
        next: number | null;
        prev: number | null;
        total: number;
    }
}
