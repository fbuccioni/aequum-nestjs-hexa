import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AuthRefreshTokenCompliantUsersService
} from '@aequum/nestjs-authn/interfaces';
import { BaseCRUDLTypeORMService } from '@aequum/typeorm/services';
import { AuthnService } from "@aequum/nestjs-authn/services";
import { AuthnConfiguration } from "@aequum/nestjs-authn/interfaces/authn-configuration.interface";
import { NotFoundException } from '@aequum/exceptions/data';

import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { User } from '../../infrastructure/database/entities/user.entity';
import { UserRefreshToken } from '../../infrastructure/database/entities/user-refresh-token.entity';
import { UserDto } from '../dtos/user.dto';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserPaginatedListDto } from '../dtos/user-paginated-list.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { default as configuration } from '../api/configuration';



@Injectable()
export class UsersService extends BaseCRUDLTypeORMService<
    User,
    UserDto,
    UserCreateDto,
    UserUpdateDto
> implements AuthRefreshTokenCompliantUsersService<UserDto> {
    constructor(
        @InjectRepository(User) protected repository: UserRepository
    ) {
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

    /** @inheritdoc */
    async create(data: UserCreateDto): Promise<UserDto> {
        const self = this.constructor as typeof UsersService;
        self.hashPassword(data, configuration().authentication);
        const user = await super.create(data);
        return user;
    }

    /** @inheritdoc */
    async updateBy(filter: any, data: UserUpdateDto): Promise<UserDto> {
        const self = this.constructor as typeof UsersService;
        self.hashPassword(data, configuration().authentication);
        const updated = await super.updateBy(filter, data);
        return updated;
    }

    /** @inheritdoc */
    async addRefreshToken(id: string, refreshToken: string): Promise<void> {
        const refreshTokenEntity = new UserRefreshToken();
        refreshTokenEntity.refreshToken = refreshToken;
        refreshTokenEntity.user = { [this.primaryKeyField]: id } as User;
        await this.repository.manager.save(refreshTokenEntity);
    }

    /** @inheritdoc */
    async removeRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.repository.createQueryBuilder()
            .delete()
            .from(UserRefreshToken)
            .where({  user: { id }, refreshToken })
            .execute();
    }

    /** @inheritdoc */
    async retrieveByRefreshToken(refreshToken: string): Promise<UserDto> {
        const user = await this.repository.createQueryBuilder()
            .leftJoinAndSelect('User.refreshToken', 'refreshToken')
            .where('refreshToken.refreshToken = :refreshToken', { refreshToken })
            .getOne();

        if (!user) throw new NotFoundException();
        return user;
    }
}