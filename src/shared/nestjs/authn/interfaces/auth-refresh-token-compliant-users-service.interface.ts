import { AuthCompliantUsersService } from './auth-compliant-users-service.interface';


export interface AuthRefreshTokenCompliantUsersService<User>
extends AuthCompliantUsersService<User> {
    addRefreshToken(userId: string, refreshToken: string): Promise<void>;
    removeRefreshToken(userId: string, refreshToken: string): Promise<void>;
    retrieveByRefreshToken(refreshToken: string): Promise<User>;
}
