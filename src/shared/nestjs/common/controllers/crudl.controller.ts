import { PARAMTYPES_METADATA } from "@nestjs/common/constants";
import { Body, Delete, ForbiddenException, Get, HttpCode, Param, Patch, PipeTransform, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { BaseCRUDLService } from "../../../common/services/base-crudl.service";
import { ClassConstructor } from '../../../common/types/class-constructor.type';
import { capitalize as cap } from '../../../common/utils/string.util';


/**
 * CRUDLController options
 */
type CRUDLControllerOptions = {
    /** Information about the name of the  entity */
    name: {
        /** Singular name of the entity */
        singular: string,
        /** Plural name of the entity */
        plural: string,
    };

    /** Options related to the ID of the entity */
    id: {
        /** Type of the ID this can be a class/constructor */
        type: 'string' | 'number' | ClassConstructor<any>,
        /** Pipe to be used to validate the ID */
        validationPipe: ClassConstructor<PipeTransform>
    };
    /** Forbid actions */
    forbid?: {
        /** Forbid the deletion */
        delete?: boolean
    }
}


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
    const ApiResponseNotFound = ApiResponse({
        status: 404,
        description: `${cap(options.name.singular)} not found.`,
    });

    type ModelDtoRealType = InstanceType<ModelDtoType>;
    type ModelCreateDtoRealType = InstanceType<ModelCreateDtoType>;
    type ModelUpdateDtoRealType = InstanceType<ModelUpdateDtoType>;

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
        async create(@Body() body: ModelCreateDtoRealType): Promise<ModelDtoRealType> {
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
        async list(): Promise<ModelDtoRealType[]> {
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
         * @returns A promise of the retrieved entity DTO.
         */
        @ApiOperation({ summary: 'Get a user by ID' })
        @ApiResponse({
            status: 200,
            description: `The ${options.name.singular} retrieved successfully.`,
            type: ModelDto,
        })
        @ApiResponseNotFound
        @Get(':id')
        async retrieve(
            @Param('id', options.id.validationPipe) id: ModelDtoRealType['id']
        ): Promise<ModelDtoRealType> {
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
         * @returns A promise of the updated entity DTO.
         */
        @ApiOperation({ summary: 'Update a user by ID' })
        @ApiResponse({
            status: 200,
            description: `The ${options.name.singular} has been successfully updated.`,
            type: ModelUpdateDto,
        })
        @ApiResponseNotFound
        @Patch(':id')
        async update(
            @Param('id', options.id.validationPipe) id: ModelDtoRealType['id'],
            @Body() body: ModelUpdateDtoRealType
        ): Promise<ModelDtoRealType> {
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
        @Delete(':id')
        @HttpCode(204)
        async delete(@Param('id', options.id.validationPipe) id: ModelDtoRealType['id']): Promise<void> {
            if (options.forbid?.delete)
                throw new ForbiddenException(`Deleting ${options.name.singular} is forbidden.`);

            return this.service.delete(id);
        }
    }

    // Workaround to fix the issues with the metadata
    type KeyDataTuple = [ string, any[] ];
    const idType = (
        options.id.type === 'string' ? String :
        options.id.type === 'number' ? Number :
        options.id.type
    )
    const setMethodsParamTypeMeta = (keysData: KeyDataTuple[]) => {
        for (const [ key, data ] of keysData)
            Reflect.defineMetadata(
                PARAMTYPES_METADATA, data,
                CRUDLController.prototype, key
            );
    }

    setMethodsParamTypeMeta([
        [ 'create', [ ModelCreateDto ] ],
        [ 'retrieve', [ idType ] ],
        [ 'update', [ idType, ModelUpdateDto ] ],
        [ 'delete', [ idType ] ],
    ]);
    // End workaround

    return CRUDLController;
}
