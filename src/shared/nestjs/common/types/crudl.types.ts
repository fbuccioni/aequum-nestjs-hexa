import { ClassConstructor } from '../../../common/types/class-constructor.type';
import { PipeTransform } from '@nestjs/common';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CRUDLMethods = [ 'create', 'retrieve', 'update', 'delete', 'list' ] as const;

export type CRUDLMappedMethods<T = any> = {
    [K in (typeof CRUDLMethods)[number]]: T;
};

export type CRUDLMappedMethodsWithAll<T = any> = CRUDLMappedMethods<T> & { '*': T };

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
        type: 'string' | 'number' | ClassConstructor<any>;
        /** Pipe to be used to validate the ID */
        validationPipe: ClassConstructor<PipeTransform>;
    };

    /** Forbid actions */
    forbid?: {
        /** Forbid the deletion */
        delete?: boolean;
    };

    /** auth */
    auth?: string | string[];

    /** Apply decorators on methods, '*' will apply to all methods */
    applyDecorators?: Partial<CRUDLMappedMethodsWithAll<MethodDecorator[]>>;

    /**
     * Transformation of the entity cases
     */
    transform?: {
        body?: { input?: (data: any) => any };
        id?: { input?: (data: any) => any };
    };
};
