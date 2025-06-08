import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/domain/models/user.model';


export class UserDto extends User {
    @ApiProperty({ description: 'Identifier', pattern: '^[a-f\\d]{24}$' })
    id: string;

    // eslint-disable-next-line no-useless-escape
    @ApiProperty({ description: 'User name', pattern: '^[\w_.-]+$', minLength: 3 })
    username: string;

    @ApiProperty({
        description: 'Password',
        minLength: 8,
    })
    password: string;

    @ApiProperty({ description: 'Name of the user', minLength: 3 })
    name: string;

    @ApiProperty({ description: 'Enabled?' })
    enabled: boolean;
}
