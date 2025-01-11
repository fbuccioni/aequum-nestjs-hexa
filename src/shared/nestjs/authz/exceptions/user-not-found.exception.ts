export class UserNotFoundException extends Error {
    constructor() {
        super(`[Authorization] User not found in request`);

        const self = this.constructor as typeof UserNotFoundException;
        this.name = self.name;
    }
}
