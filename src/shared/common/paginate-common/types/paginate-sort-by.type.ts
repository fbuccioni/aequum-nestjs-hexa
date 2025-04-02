/**
 * Sort object, like the MongoDB database sort object, must have the field name
 * as key and for value you should use `'asc'`, `'desc'`, `1` for ascendant and
 * `-1` for descendant.
 *
 * In MongoDB you could use dot notation for nested document fields
 */
export type PaginateSortBy = {
    [key: string]: 'asc' | 'desc' | 1 | -1;
};
