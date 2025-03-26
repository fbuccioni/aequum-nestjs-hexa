const AsyncFunctionConstructor = (async () => {}).constructor;

/**
 * Check if a function is async
 *
 * @param fn Function to check
 * @returns True if the function is async
 */
export const isAsync = (fn: any): boolean => {
    return fn instanceof AsyncFunctionConstructor;
};
