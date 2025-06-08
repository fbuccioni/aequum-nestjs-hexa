import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Index
} from 'typeorm';

import { User } from './user.entity';


@Entity('users_refresh_tokens')
@Index('idx_user_refresh_token', ['user', 'refreshToken'], { unique: true })
export class UserRefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.refreshToken)
    user: User

    @Column({ nullable: false })
    refreshToken: string;
}