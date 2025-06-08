import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CRUDLPaginatedController } from "@aequum/nestjs-crudl/controllers";
import { uniformDataOutputTransform, UniformDataDto } from '@aequum/nestjs-uniform-data';

import { UsersService } from '../../../services/users.service';
import { UserCreateDto } from '../../../dtos/user-create.dto';
import { UserUpdateDto } from '../../../dtos/user-update.dto';
import { UserRetrieveDto } from "../../../dtos/user-retrieve.dto";
import { UserPaginatedListDto } from "../../../dtos/user-paginated-list.dto";


@ApiTags('User')
@Controller('users')
export class UsersController extends CRUDLPaginatedController(
    UniformDataDto(UserRetrieveDto),
    UserPaginatedListDto,
    UserCreateDto,
    UserUpdateDto,
    null,
    {
        name: {
            singular: 'user',
            plural: 'users',
        },
        id: {
            type: String,
            validationPipe: ParseUUIDPipe,
            routeParam: 'userId',
        },
        auth: 'jwt',
        transform: {
            body: {
                input: (body, req: any, op: string) => {
                    // Ensure refreshToken is an array for create operation
                    if (!body?.refreshToken && op === 'create')
                        body.refreshToken = [];
                },
                output: async <T>(body: T, req: any, op: string) => {
                    // Remove password from output
                    const isPaginatedList = (
                        op === 'list'
                        && (body as any).paginator
                    );
                    const data = isPaginatedList ? (body as any).data: body;

                    if (Array.isArray(data))
                        data.forEach((user) => delete user.password);
                    else
                        delete data.password;

                    if (isPaginatedList) return body;

                    // For non-paginated output, return uniorm data ({ data: body })
                    return uniformDataOutputTransform(body)
                }
            }

        },
    }
) {
    constructor(public readonly service: UsersService) {
        super();
    }
}
