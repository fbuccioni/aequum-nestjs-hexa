import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../../infrastructure/database/schemas/user.schema';
import { UserRepository } from '../../../infrastructure/database/repositories/user.repository';
import { UsersService } from '../../services/users.service';
import { UsersController } from './controller/users.controller';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [UsersService, UserRepository],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
