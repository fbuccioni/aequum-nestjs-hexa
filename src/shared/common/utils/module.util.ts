export function toArray(m: object): object[] {
    return Object.values(m)
        .map((e) => typeof e === 'object' ? toArray(e) : e)
        .filter((m) => Array.isArray(m) || typeof m === 'function');
}

export function toFlattenArray(m: object) {
    return Array.from(toArray(m).flat());
}
