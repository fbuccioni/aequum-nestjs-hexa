import { PaginatedDto } from "@aequum/nestjs-paginate-common/dtos";

import { UserRetrieveDto } from "./user-retrieve.dto";


export class UserPaginatedListDto extends PaginatedDto(UserRetrieveDto) { }
