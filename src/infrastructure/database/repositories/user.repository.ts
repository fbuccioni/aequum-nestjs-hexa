import { InMemoryRepository } from '@aequum/in-memory/repositories';

import { User } from "../../../domain/models/user.model";


export class UserRepository extends InMemoryRepository<User, 'id'> {
    protected data: User[] = [
        {
            id: "e16b5c4a-49ce-4968-ab85-33fc2a60b071",
            name: "System Administrator",
            username: "admin",
            // `admin` as default password
            password: "$2a$12$LZTcYIsTD.66c2qXEgLETehSwQHV9y8CLMEnz2A2S3X67bKw7.ZpG",
            enabled: true,
            refreshToken: []
        }
    ]
}