import { Injectable } from '@nestjs/common';
import {
    AuthRefreshTokenCompliantUsersService
} from '@aequum/nestjs-authn/interfaces';
import { BaseCRUDLMongoosePaginatedService } from '@aequum/mongoose/services';
import { AuthnService } from "@aequum/nestjs-authn/services";
import { AuthnConfiguration } from "@aequum/nestjs-authn/interfaces/authn-configuration.interface";

import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { User } from '../../infrastructure/database/schemas/user.schema';
import { UserDto } from '../dtos/user.dto';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserPaginatedListDto } from '../dtos/user-paginated-list.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { default as configuration } from '../api/configuration';


@Injectable()
export class UsersService extends BaseCRUDLMongoosePaginatedService<
    User,
    UserDto,
    UserCreateDto,
    UserUpdateDto,
    UserPaginatedListDto
> implements AuthRefreshTokenCompliantUsersService<UserDto> {
    protected readonly primaryKeyField = 'id';

    constructor(protected repository: UserRepository) {
        super();
    }

    static hashPassword(
        user: UserCreateDto | UserUpdateDto,
        configuration: AuthnConfiguration
    ): void {
        if (user?.password)
            user.password = AuthnService.hashPassword(
                user.password, configuration
            );
    }

    async create(data: UserCreateDto): Promise<UserDto> {
        const self = this.constructor as typeof UsersService;
        self.hashPassword(data, configuration().authentication);
        const user = await super.create(data);
        return user;
    }

    async updateBy(filter: any, data: UserUpdateDto): Promise<UserDto> {
        const self = this.constructor as typeof UsersService;
        self.hashPassword(data, configuration().authentication);
        const updated = await super.updateBy(filter, data);
        return updated;
    }

    async addRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.repository.pushOnArrayProperty(
            { [this.primaryKeyField]: id },
            'refreshToken',
            refreshToken
        );
    }

    async removeRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.repository.pullFromArrayProperty(
            { [this.primaryKeyField]: id },
            'refreshToken',
            refreshToken
        );
    }

    async retrieveByRefreshToken(refreshToken: string): Promise<UserDto> {
        return this.retrieveBy({ refreshToken } as any);
    }
}