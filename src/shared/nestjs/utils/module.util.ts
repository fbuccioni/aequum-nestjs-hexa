import { DynamicModule, ForwardReference } from '@nestjs/common';


type ModuleLike = DynamicModule | Promise<DynamicModule> | ForwardReference<any>

export function toArray<T extends {}>(m: T, recursive = true): ModuleLike[] {
    const moduleArray = Object.values(m)
        .filter((m) => typeof m === 'function' || (recursive && Array.isArray(m)));

    if (recursive)
        moduleArray.map((e) => typeof e === 'object' ? toArray(e as {}) : e);

    return moduleArray as ModuleLike[];
}

export function toFlattenArray<T extends {}>(m: T): ModuleLike[] {
    return Array.from(toArray(m).flat());
}
