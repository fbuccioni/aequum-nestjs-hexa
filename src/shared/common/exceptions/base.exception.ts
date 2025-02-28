export class BaseException extends Error {
    static code: string = null;
    static HTTPStatusCode: number = undefined;

    readonly code = undefined;

    constructor(message: string, options?: Record<string, any>, stack?: string) {
        super(message, options);

        const self = this.constructor as typeof BaseException;

        this.name = self.name;
        if (self.code) this.code = self.code;
        if (stack) this.stack = stack;

        const enumPropDesc = (e: boolean) => ({
            enumerable: e,
            writable: true,
            configurable: false,
        });

        Object.defineProperty(this, 'name', enumPropDesc(false));
        Object.defineProperty(this, 'message', enumPropDesc(true));
    }
}

Object.defineProperty(BaseException.prototype, 'code', {
    enumerable: false,
    writable: true,
    configurable: true,
});
