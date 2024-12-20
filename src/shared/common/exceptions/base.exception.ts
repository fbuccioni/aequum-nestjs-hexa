export default class BaseException extends Error {
    static code = null;
    readonly code = undefined;

    constructor(message: string, options?: Record<string, any>, stack?: string) {
        super(message, options);

        let self = this.constructor as typeof BaseException;

        this.name = self.name;
        if (self.code) this.code = self.code;
        if (stack) this.stack = stack;
    }
}

Object.defineProperty(BaseException.prototype, 'code', {
    enumerable: false,
    writable: true,
    configurable: true,
});
