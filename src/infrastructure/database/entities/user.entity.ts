import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

import { User as UserModel } from '../../../domain/models/user.model';
import { UserRefreshToken } from './user-refresh-token.entity';


@Entity('users')
export class User extends UserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => UserRefreshToken, (refreshToken) => refreshToken.user)
    refreshToken: string[];

    @Column({ default: true })
    enabled: boolean;
}
