import { PipeTransform } from '@nestjs/common';

import { ClassConstructor } from '../../../common/types/class-constructor.type';


/**
 * List of CRUDL operations
 */
export const CRUDLOperationsList = [
    'create', 'retrieve', 'update', 'delete', 'list'
] as const;

/**
 * CRUDL operations literals
 */
export type CRUDLOperations = typeof CRUDLOperationsList[number];

/**
 * CRUDL operations mapped to a type
 */
export type CRUDLMappedOperations<T = any> = { [ operation in CRUDLOperations ]: T; };

/**
 * CRUDL operations with an additional `*` key for all operations
 * mapped to a type
 */
export type CRUDLMappedOperationsWithAll<T = any> = CRUDLMappedOperations<T> & { '*': T };

/**
 * Input data transformation function, the transform must be done on
 * input argument not by return
 *
 * @param data Data to be transformed, can be the body, filter or id
 * @param request Request object
 * @param operation Operation to be performed
 */
export type CRUDLTransformInputFunction = (input: any, request: any, operation: string ) => void;

/**
 * Output transformation function, the transform must be done by return
 *
 * @param data Data to be transformed, can be the body, filter or id
 * @param request Request object
 * @param operation Operation to be performed
 *
 * @return Transformed data
 */
export type CRUDLTransformOutputFunction = (input: any, request: any, operation: string) => any;

/**
 * CRUDLController options
 */
export type CRUDLControllerOptions = {
    /** Information about the name of the  entity */
    name: {
        /** Singular name of the entity */
        singular: string;
        /** Plural name of the entity */
        plural: string;
    };

    /** Options related to the ID of the entity */
    id: {
        /** Type of the ID this can be a class/constructor */
        type: 'string' | 'number' | ClassConstructor;
        /** Pipe to be used to validate the ID */
        validationPipe: ClassConstructor<PipeTransform>;
        /** Route param name */
        routeParam?: string;
    };

    /** Forbid actions */
    forbid?: Partial<CRUDLMappedOperations<boolean>>;

    /** auth */
    auth?: string | string[];

    /** Apply decorators on methods, '*' will apply to all methods */
    applyDecorators?: Partial<CRUDLMappedOperationsWithAll<MethodDecorator[]>>;

    /**
     * Transformation of the entity cases
     */
    transform?: {
        filter?: { input?: CRUDLTransformInputFunction} ;
        body?: {
            input?: CRUDLTransformInputFunction,
            output?: CRUDLTransformOutputFunction
        } ;
        id?: { input?: CRUDLTransformInputFunction} ;
    };
};

