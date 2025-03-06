const AsyncFunctionConstructor = (async () => {}).constructor;

export const isAsync = (fn: any): boolean => {
    return fn instanceof AsyncFunctionConstructor;
};
