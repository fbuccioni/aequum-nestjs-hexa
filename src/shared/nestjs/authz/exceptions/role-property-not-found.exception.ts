export class RolePropertyNotFoundException extends Error {
    constructor(roleProperty: string) {
        super(`[Authorization] Role property "${roleProperty}" not found in request user object`);

        const self = this.constructor as typeof RolePropertyNotFoundException;
        this.name = self.name;
    }
}
