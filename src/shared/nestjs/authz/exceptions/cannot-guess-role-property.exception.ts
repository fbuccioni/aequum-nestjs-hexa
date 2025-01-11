export class CannotGuessRolePropertyException extends Error {
    constructor() {
        super(
            '[Authorization] Cannot guess the role property in the request '
            + 'user object. Please provide a role property name via the '
            + '`authorization.rolesUserProperty` config or the '
            + '`rolesUserProperty` property in RBAC guard class. '
        );
    }
}
