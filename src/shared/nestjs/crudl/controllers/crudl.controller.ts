import {
    Body,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    Param,
    Patch,
    Post, Query,
    Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { BaseCRUDLService } from "../../../common/crudl/services/base-crudl.service";
import { capitalize as cap } from '../../../common/utils/string.util';
import { ClassConstructor } from "../../../common/types/class-constructor.type";
import * as CRUDLUtil from '../utils/crudl.util'
import { CRUDLControllerOptions } from "../types/crudl.types";


export type SharedListDtoType<T> = T extends Array<infer U extends ClassConstructor>
    ? InstanceType<U>[]
    : T extends ClassConstructor ? InstanceType<T>: never
;

/**
 * Factory function to create a CRUDLController class, a controller with CRUDL operations.
 *
 * The generated controller will have:
 * - HTTP return codes
 * - Swagger decorators `@ApiOperation` and `@ApiResponse`
 * - Properly typed parameters for input and output of the methods
 * - Properly typed parameters for the ID and body
 *
 * NOTE: All types will be processed with `InstanceType` to get the correct type to work with.
 *
 * @typeParam ModelDtoType - Type from `ModelDto` parameter. (`typeof ModelDto`)
 * @typeParam ModelListDtoType - Type from `ModelListDto` parameter. (`typeof ModelListDto`)
 * @typeParam ModelCreateDtoType - Type from `ModelCreateDto` parameter. (`typeof ModelCreateDto`)
 * @typeParam ModelUpdateDtoType - Type from `ModelUpdateDto` parameter. (`typeof ModelUpdateDto`)
 * @typeParam ModelFilterDtoType - Type from `ModelFilterDto` parameter. (`typeof ModelFilterDto`)
 *
 * @param ModelDto - The DTO class for the model.
 * @param ModelListDto - The DTO class for the list of the model.
 * @param ModelCreateDto - The DTO class for creating the model.
 * @param ModelUpdateDto - The DTO class for updating the model.
 * @param ModelFilterDto - The DTO class for filtering the model.
 * @param options - The options for the CRUDLController.
 * @returns The CRUDLController class.
 */
export function CRUDLController<
    ModelDtoType extends ClassConstructor,
    ModelListDtoType extends ClassConstructor | [ ClassConstructor ],
    ModelCreateDtoType extends ClassConstructor,
    ModelUpdateDtoType extends ClassConstructor,
    ModelFilterDtoType extends ClassConstructor = null,
>(
    ModelDto: ModelDtoType,
    ModelListDto: ModelListDtoType,
    ModelCreateDto: ModelCreateDtoType,
    ModelUpdateDto: ModelUpdateDtoType,
    ModelFilterDto: ModelFilterDtoType,
    options?: CRUDLControllerOptions,
    postProcess: boolean = true,
) {
    const CreateDto = ModelCreateDto
    const RetrieveDto = ModelDto
    const UpdateDto = ModelUpdateDto
    const ListDto = ModelListDto

    type FilterDtoType = InstanceType<ModelFilterDtoType>;
    type CreateDtoType = InstanceType<ModelCreateDtoType>;
    type RetrieveDtoType = InstanceType<ModelDtoType>;
    type UpdateDtoType = InstanceType<ModelUpdateDtoType>;
    type ListDtoType = SharedListDtoType<ModelListDtoType>;

    const ApiResponseNotFound = ApiResponse({
        status: 404,
        description: `${cap(options.name.singular)} not found.`,
    });
    const idRouteParam = options?.id?.routeParam || 'id' ;

    /**
     * A Controller class with CRUDL operations.
     */
    abstract class CRUDLController {
        protected readonly service: BaseCRUDLService;

        /**
         * Handles the creation of a new entity.
         *
         * @decorator `@ApiOperation({ summary: `Create a new ${options.name.singular}` })`
         * @decorator `@ApiResponse({
         *     status: 201,
         *     description: `The ${options.name.singular} has been successfully created.`,
         *     type: ModelCreateDto,
         * })`
         * @decorator `@Post()`
         * @decorator `@HttpCode(201)`
         *
         * @param body - DTO of the entity to be created.
         * @param request - Request object.
         * @returns A promise of the created entity DTO.
         */
        @ApiOperation({ summary: `Create a new ${options.name.singular}` })
        @ApiResponse({
            status: 201,
            description: `The ${options.name.singular} has been successfully created.`,
            type: RetrieveDto,
        })
        @Post()
        @HttpCode(201)
        async create(
            @Body() body: CreateDtoType,
            @Req() request: any,
            ...args: any[]
        ): Promise<RetrieveDtoType> {
            if (options.forbid?.create)
                throw new ForbiddenException(`Create ${options.name.singular} is forbidden.`);

            await CRUDLUtil.applyTransform(
                options.transform?.body?.input,
                body, request, 'create'
            );

            let responseBody = await this.service.create(body);
            if (options.transform?.body?.output) {
                responseBody = await CRUDLUtil.applyTransform(
                    options.transform?.body?.output,
                    responseBody, request, 'retrieve'
                )
            }
            return responseBody;
        }

        /**
         * Handles the retrieval of all entities.
         *
         * @decorator `@ApiOperation({ summary: `Get all ${options.name.plural}` })`
         * @decorator `@ApiResponse({
         *     status: 200,
         *     description: `List of ${options.name.plural} retrieved successfully.`,
         *     type: [ ModelDto ],
         * })`
         * @decorator `@Get()`
         * @param request - Request object.
         * @param filter - Filter object.(The rest of the queryString)
         *
         * @returns A promise of the list of entity DTOs.
         */
        @ApiOperation({ summary: `Get all ${options.name.plural}` })
        @ApiResponse({
            status: 200,
            description: `List of ${options.name.plural} retrieved successfully.`,
            type: ListDto as any,
        })
        @Get()
        async list(
            @Query() filter: FilterDtoType,
            @Req() request: any,
            ...args: any[]
        ): Promise<ListDtoType> {
            if (options.forbid?.list)
                throw new ForbiddenException(`Listing ${options.name.plural} is forbidden.`);

            await CRUDLUtil.applyTransform(
                options.transform?.filter?.input,
                filter, request, 'list'
            );

            let responseBody: any = await this.service.list(filter);
            if (options.transform?.body?.output) {
                responseBody = await CRUDLUtil.applyTransform(
                    options.transform?.body?.output,
                    responseBody, request, 'retrieve'
                )
            }
            return responseBody;
        }

        /**
         * Handles the retrieval of an entity by ID.
         *
         * @decorator `@ApiOperation({ summary: 'Get a user by ID' })`
         * @decorator `@ApiResponse({
         *     status: 200,
         *     description: `The ${options.name.singular} retrieved successfully.`,
         *     type: ModelDto,
         * })`
         * @decorator `@ApiResponseNotFound`
         * @decorator `@Get(':id')`
         *
         * @param id - ID of the entity to be retrieved.
         * @param request - Request object.
         * @returns A promise of the retrieved entity DTO.
         */
        @ApiOperation({ summary: 'Get a user by ID' })
        @ApiResponse({
            status: 200,
            description: `The ${options.name.singular} retrieved successfully.`,
            type: RetrieveDto,
        })
        @ApiResponseNotFound
        @Get(`:${idRouteParam}`)
        async retrieve(
            @Param(idRouteParam, options.id.validationPipe) id: RetrieveDtoType['id'],
            @Req() request: any,
            ...args: any[]
        ): Promise<RetrieveDtoType> {
            if (options.forbid?.retrieve)
                throw new ForbiddenException(`Retrieving ${options.name.singular} is forbidden.`);

            const filter = { id };

            await CRUDLUtil.applyTransform(
                options.transform?.filter?.input,
                filter, request, 'list'
            );

            await CRUDLUtil.applyTransform(
                options.transform?.id?.input,
                id, request, 'retrieve'
            );

            let responseBody = await this.service.retrieveBy(filter);
            if (options.transform?.body?.output) {
                responseBody = await CRUDLUtil.applyTransform(
                    options.transform?.body?.output,
                    responseBody, request, 'retrieve'
                )
            }
            return responseBody;
        }

        /**
         * Handles the update of an entity by ID.
         *
         * @decorator `@ApiOperation({ summary: 'Update a user by ID' })`
         * @decorator `@ApiResponse({
         *     status: 200,
         *     description: `The ${options.name.singular} has been successfully updated.`,
         *     type: ModelUpdateDto,
         * })`
         * @decorator `@ApiResponseNotFound`
         * @decorator `@Patch(':id')`
         *
         * @param id - ID of the entity to be updated.
         * @param body - DTO of the entity to be updated.
         * @param request - Request object.
         * @returns A promise of the updated entity DTO.
         */
        @ApiOperation({ summary: 'Update a user by ID' })
        @ApiResponse({
            status: 200,
            description: `The ${options.name.singular} has been successfully updated.`,
            type: RetrieveDto,
        })
        @ApiResponseNotFound
        @Patch(`:${idRouteParam}`)
        async update(
            @Param(idRouteParam, options.id.validationPipe) id: RetrieveDtoType['id'],
            @Body() body: UpdateDtoType,
            @Req() request: any,
            ...args: any[]
        ): Promise<RetrieveDtoType> {
            if (options.forbid?.update)
                throw new ForbiddenException(`Updating ${options.name.singular} is forbidden.`);

            const filter = { id };

            await CRUDLUtil.applyTransform(
                options.transform?.filter?.input,
                filter, request, 'list'
            );
            await CRUDLUtil.applyTransform(
                options.transform?.id?.input,
                id, request, 'update'
            );
            await CRUDLUtil.applyTransform(
                options.transform?.body?.input,
                body, request, 'update'
            );


            let responseBody = await this.service.updateBy(filter, body);
            if (options.transform?.body?.output) {
                responseBody = await CRUDLUtil.applyTransform(
                    options.transform?.body?.output,
                    responseBody, request, 'retrieve'
                )
            }
            return responseBody;
        }

        /**
         * Handles the deletion of an entity by ID.
         *
         * @decorator `@ApiOperation({ summary: `Delete a ${options.name.singular} by ID` })`
         * @decorator `@ApiResponse({
         *     status: 204,
         *     description: `The ${options.name.singular} has been successfully deleted.`,
         * })`
         * @decorator `@ApiResponse({
         *     status: 403,
         *     description: `The deletion of ${options.name.singular} is forbidden.`,
         * })`
         * @decorator `@ApiResponseNotFound`
         * @decorator `@Delete(':id')`
         * @decorator `@HttpCode(204)`
         *
         * @param id - ID of the entity to be deleted.
         * @param request - Request object.
         * @returns A promise of void.
         */
        @ApiOperation({ summary: `Delete a ${options.name.singular} by ID` })
        @ApiResponse({
            status: 204,
            description: `The ${options.name.singular} has been successfully deleted.`,
        })
        @ApiResponse({
            status: 403,
            description: `The deletion of ${options.name.singular} is forbidden.`,
        })
        @ApiResponseNotFound
        @Delete(`:${idRouteParam}`)
        @HttpCode(204)
        async delete(
            @Param(idRouteParam, options.id.validationPipe) id: RetrieveDtoType['id'],
            @Req() request: any,
            ...args: any[]
        ): Promise<void> {
            if (options.forbid?.delete)
                throw new ForbiddenException(`Deleting ${options.name.singular} is forbidden.`);

            const filter = { id };

            await CRUDLUtil.applyTransform(
                options.transform?.filter?.input,
                filter, request, 'list'
            );
            await CRUDLUtil.applyTransform(
                options.transform?.id?.input,
                id, request, 'update'
            );

            return this.service.deleteBy(filter);
        }
    }

    if (postProcess) CRUDLUtil.postProcessClass(
        CRUDLController, ModelCreateDto, ModelUpdateDto, ModelFilterDto, options
    )

    return CRUDLController;
}
