import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoosePaginatedRepository } from "@aequum/mongoose/repositories/paginated";
import 'mongoose-paginate-v2'

import { User } from '../schemas/user.schema';


@Injectable()
export class UserRepository extends MongoosePaginatedRepository<User> {
    constructor(@InjectModel(User.name) protected model: mongoose.PaginateModel<User>) {
        super();
    }
}
