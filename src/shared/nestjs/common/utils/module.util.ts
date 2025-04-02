/**
 * Convert module objects to an array
 *
 * @param m - Module object
 * @param recursive - If true, recursively convert all objects
 */
export function toArray(m: any, recursive = true): unknown[] {
    const moduleArray = Object.values(m)
        .filter((m) => typeof m === 'function' || (recursive && Array.isArray(m)));

    if (recursive)
        moduleArray.map((e) => typeof e === 'object' ? toArray(e) : e);

    return moduleArray;
}

/**
 * Convert module objects recursively to a flatten array
 *
 * @param m - Module object
 */
export function toFlattenArray(m: any) {
    return Array.from(toArray(m, true).flat());
}
