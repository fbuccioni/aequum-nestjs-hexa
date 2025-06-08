import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { schemaTransformsForVirtualID } from '@aequum/mongoose/utils';
import { VirtualID } from '@aequum/nestjs-mongoose/decorators';
import paginate from "mongoose-paginate-v2";

import { User as UserModel } from '../../../domain/models/user.model';


@Schema()
export class User extends UserModel {
    @VirtualID()
    id: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({ select: false })
    refreshToken: string[];

    @Prop({ default: false })
    enabled: boolean;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = schemaTransformsForVirtualID(
    SchemaFactory.createForClass(User)
);

UserSchema.plugin(paginate);
