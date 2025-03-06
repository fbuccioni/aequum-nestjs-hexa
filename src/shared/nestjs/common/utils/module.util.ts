export function toArray(m: any, recursive = true): unknown[] {
    const moduleArray = Object.values(m)
        .filter((m) => typeof m === 'function' || (recursive && Array.isArray(m)));

    if (recursive)
        moduleArray.map((e) => typeof e === 'object' ? toArray(e) : e);

    return moduleArray;
}

export function toFlattenArray(m: any) {
    return Array.from(toArray(m).flat());
}
