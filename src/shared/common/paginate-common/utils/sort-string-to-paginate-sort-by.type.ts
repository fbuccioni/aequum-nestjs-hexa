import { PaginateSortBy } from '../types/paginate-sort-by.type';


/**
 * Convert a string to a PaginateSortBy object, the format for this string
 * is a separated string list of the field in the schema or model, if you
 * want a descending sort just prepend the field with `-`
 *
 * @example "name -age" // This will sort ascending for name and descending for age
 * @param sort Sort string
 * @param separator Field separator for the string, default to space ` `,
 */
export function sortStringToPaginateSortBy(
    sort: string,
    separator: string = ' '
): PaginateSortBy {
    const sortBy: PaginateSortBy = {};

    if (typeof(sort) === 'string') {
        sort = sort.trim().replace(/\s+/g, ' ');

        if (sort)
            for (const sortItem of sort.split(separator))
                sortBy[sortItem] = sortItem.startsWith('-') ? -1 : 1;
    }

    return sortBy;
}
