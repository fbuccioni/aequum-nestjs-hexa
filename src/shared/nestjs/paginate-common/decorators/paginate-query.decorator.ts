import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { PaginateRequest } from '../interfaces/paginate-request.interface';


const parseIntParam = (query: any, params: any, name: string) => {
    if (!query[name]) return;

    if (/^\d+$/.test(query[name])) {
        let value = parseInt(query[name], 10)
        if (value < 1) value = 1;
        params[name] = value;
    }

    delete query[name]
}

/**
 * Extracts the pagination parameters from the request query,
 * removes them from the query object and return the
 * pagination parameters.
 *
 * @param query - Request query object
 * @returns PaginateRequest - Pagination parameters
 */
export function fillPaginateRequestFromQuery(query: any): PaginateRequest {
    const paginationParams: PaginateRequest = {
        page: 1,
        size: 10,
    };

    if (query.page)
        parseIntParam(query, paginationParams, 'page');

    if (query.size)
        parseIntParam(query, paginationParams, 'size');

    if (query.sortBy) {
        paginationParams.sortBy = query.sortBy as string;
        delete query.sortBy;
    }

    return paginationParams;
}

/**
 * An attempt of parameter decorator to extract the pagination parameters
 * from the request query, but it's not working as expected.
 *
 * @decorator
 */
export const PaginateQuery = () => createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): PaginateRequest => {
        let query: Record<string, unknown>;

        switch (ctx.getType()) {
            case 'http':
                const request: any = ctx.switchToHttp().getRequest();
                query = request.query as Record<string, unknown>;
                break;
            case 'ws':
                query = ctx.switchToWs().getData();
                break;
            case 'rpc':
                query = ctx.switchToRpc().getData();
                break;
        }

        return fillPaginateRequestFromQuery(query);
    }
)();
