export interface AuthCompliantUsersService<User> {
    retrieveBy(filter: any): Promise<User>;
}
