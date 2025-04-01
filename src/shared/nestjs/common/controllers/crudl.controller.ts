import { PARAMTYPES_METADATA } from "@nestjs/common/constants";
import {
    Body,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { BaseCRUDLService } from "../../../common/services/base-crudl.service";
import { capitalize as cap } from '../../../common/utils/string.util';
import { swaggerAuthModName } from '../../authn/utils/authn.util';
import { CRUDLControllerOptions, CRUDLMethods } from "../types/crudl.types";

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
 * @typeParam ModelCreateDtoType - Type from `ModelCreateDto` parameter. (`typeof ModelCreateDto`)
 * @typeParam ModelUpdateDtoType - Type from `ModelUpdateDto` parameter. (`typeof ModelUpdateDto`)
 *
 * @param ModelDto - The DTO class for the model.
 * @param ModelCreateDto - The DTO class for creating the model.
 * @param ModelUpdateDto - The DTO class for updating the model.
 * @param options - The options for the CRUDLController.
 *
 * @returns The CRUDLController class.
 */
export function CRUDLController<
    ModelDtoType extends new(...args: any[]) => any,
    ModelCreateDtoType extends new(...args: any[]) => any,
    ModelUpdateDtoType extends new(...args: any[]) => any
>(
    ModelDto: ModelDtoType,
    ModelCreateDto: ModelCreateDtoType,
    ModelUpdateDto: ModelUpdateDtoType,
    options: CRUDLControllerOptions
) {
    type ModelDtoRealType = InstanceType<ModelDtoType>;
    type ModelCreateDtoRealType = InstanceType<ModelCreateDtoType>;
    type ModelUpdateDtoRealType = InstanceType<ModelUpdateDtoType>;

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
            type: ModelCreateDto,
        })
        @Post()
        @HttpCode(201)
        async create(
            @Body() body: ModelCreateDtoRealType,
            @Req() request: any,
            ...args: any[]
        ): Promise<ModelDtoRealType> {
            if (options.transform?.body?.input) options.transform.body.input(body);

            return this.service.create(body);
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
         *
         * @returns A promise of the list of entity DTOs.
         */
        @ApiOperation({ summary: `Get all ${options.name.plural}` })
        @ApiResponse({
            status: 200,
            description: `List of ${options.name.plural} retrieved successfully.`,
            type: [ ModelDto ],
        })
        @Get()
        async list(
            @Req() request: any,
            ...args: any[]
        ): Promise<ModelDtoRealType[]> {
            return this.service.list();
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
            type: ModelDto,
        })
        @ApiResponseNotFound
        @Get(`:${idRouteParam}`)
        async retrieve(
            @Param(idRouteParam, options.id.validationPipe) id: ModelDtoRealType['id'],
            @Req() request: any,
            ...args: any[]
        ): Promise<ModelDtoRealType> {
            if (options.transform?.id?.input) options.transform.id.input(id);
            return this.service.retrieve(id);
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
            type: ModelUpdateDto,
        })
        @ApiResponseNotFound
        @Patch(`:${idRouteParam}`)
        async update(
            @Param(idRouteParam, options.id.validationPipe) id: ModelDtoRealType['id'],
            @Body() body: ModelUpdateDtoRealType,
            @Req() request: any,
            ...args: any[]
        ): Promise<ModelDtoRealType> {
            if (options.transform?.id?.input) options.transform.id.input(id);
            if (options.transform?.body?.input) options.transform.body.input(body);
            return this.service.update(id, body);
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
            @Param(idRouteParam, options.id.validationPipe) id: ModelDtoRealType['id'],
            @Req() request: any,
            ...args: any[]
        ): Promise<void> {
            if (options.forbid?.delete)
                throw new ForbiddenException(`Deleting ${options.name.singular} is forbidden.`);

            if (options.transform?.id?.input) options.transform.id.input(id);
            return this.service.delete(id);
        }
    }

    // Apply openapi auth decorators asynchronously
    if (options.auth && options.auth.length) {
        const authDecoNames: Array<string> = (
            Array.isArray(options.auth) ? options.auth : [ options.auth ]
        )
            .map((dn) => `Api${swaggerAuthModName(dn)}Auth`);

        void (async () => {
            const nestJSSwaggerModule = await import('@nestjs/swagger');
            for (const authDecoName of authDecoNames) {
                if (!nestJSSwaggerModule[authDecoName])
                    throw new Error(`The auth decorator '${ authDecoName }' is not available in '@nestjs/swagger'`);

                for (const method of CRUDLMethods)
                    nestJSSwaggerModule[authDecoName]()(
                        CRUDLController.prototype,
                        method,
                        Object.getOwnPropertyDescriptor(CRUDLController.prototype, method)
                    );
            }
        })();
    }

    // Apply decorators
    if (options.applyDecorators) {
        const methods = (
            ( '*' in options.applyDecorators )
                ? CRUDLMethods
                : Object.keys(options.applyDecorators)
        );

        for (const method of methods) {
            const decorators = [
                ...( options.applyDecorators['*'] || [] ),
                ...( options.applyDecorators[method] || [] )
            ]

            for (const decorator of decorators)
                decorator(
                    CRUDLController.prototype,
                    method,
                    Object.getOwnPropertyDescriptor(CRUDLController.prototype, method)
                );
        }
    }

    // Workaround to fix the issues with the metadata
    type KeyDataTuple = [ string,  any[] ];
    const idType = (
        options.id.type === 'string' ? String :
        options.id.type === 'number' ? Number :
        options.id.type
    );
    const setMethodsParamTypeMeta = (keysData: KeyDataTuple[]) => {
        for (const [ key, data ] of keysData)
            Reflect.defineMetadata(
                PARAMTYPES_METADATA, data,
                CRUDLController.prototype, key
            );
    };

    setMethodsParamTypeMeta([
        [ 'create', [ ModelCreateDto ] ],
        [ 'retrieve', [ idType ] ],
        [ 'update', [ idType, ModelUpdateDto ] ],
        [ 'delete', [ idType ] ],
    ]);
    // End workaround

    return CRUDLController;
}
