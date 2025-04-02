import { PARAMTYPES_METADATA } from "@nestjs/common/constants";
import * as nestJSSwaggerModule from "@nestjs/swagger";

import { swaggerAuthModName } from "../../authn/utils/authn.util";
import { isAsync } from "../../../common/utils/func.util";
import {
    CRUDLControllerOptions,
    CRUDLOperationsList,
    CRUDLTransformInputFunction,
    CRUDLTransformOutputFunction
} from "../types/crudl.types";


/**
 * Get the method descriptor of a class method, search also in
 * parent classes.
 *
 * @param target Object to search
 * @param method Method name
 */
function getMethodDescriptor(
    target: any,
    method: string
): PropertyDescriptor {
    if ( target === Object ) return undefined;
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, method);
    if (!descriptor)
        return getMethodDescriptor(Object.getPrototypeOf(target), method);
    return descriptor;
}

/**
 * Internal function for post-processing CRUDL controllers,
 * applying auth, decorators, custom decorators and apply
 * the correct types on metadata for the methods.
 *
 * @param CRUDLController CRUDLController based instance
 * @param ModelCreateDto Model DTO for creation to apply in methods metadata
 * @param ModelUpdateDto Model DTO for update to apply in methods metadata
 * @param ModelFilterDto Model DTO for filtering to apply in methods metadata
 * @param options The CRUDLController options
 * @param paginated Whether the controller is paginated or not
 */
export function postProcessClass(
    CRUDLController: abstract new(...args: any[]) => any,
    ModelCreateDto: any,
    ModelUpdateDto: any,
    ModelFilterDto: any,
    options: CRUDLControllerOptions,
    paginated: boolean = false
) {

    // Apply openapi auth decorators asynchronously
    if (options.auth && options.auth.length) {
        const authDecoNames: Array<string> = (
            Array.isArray(options.auth) ? options.auth : [ options.auth ]
        )
            .map((dn) => `Api${swaggerAuthModName(dn)}Auth`);

        for (const authDecoName of authDecoNames) {
            if (!nestJSSwaggerModule[authDecoName])
                throw new Error(`The auth decorator '${ authDecoName }' is not available in '@nestjs/swagger'`);

            for (const method of CRUDLOperationsList)
                nestJSSwaggerModule[authDecoName]()(
                    CRUDLController.prototype,
                    method,
                    getMethodDescriptor(CRUDLController, method)
                );
        }
    }

    if (options.applyDecorators) {
        const methods = (
            ( '*' in options.applyDecorators )
                ? CRUDLOperationsList
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
                    getMethodDescriptor(CRUDLController, method)
                );
        }
    }

    // Workaround to fix the issues with the metadata
    type KeyDataTuple = [ string,  any[] | { [ key: number ]: any } ];
    const idType = (
        options.id.type === 'string' ? String :
            options.id.type === 'number' ? Number :
                options.id.type
    );
    const setMethodsParamTypeMeta = (keysData: KeyDataTuple[]) => {
        for ( const [ key, entry ] of keysData ) {
            const args: any = Reflect.getMetadata(PARAMTYPES_METADATA, CRUDLController.prototype, key);
            if (!args) continue;

            for ( const [ idx, value ] of Object.entries(entry) )
                args[idx] = value;

            Reflect.defineMetadata(
                PARAMTYPES_METADATA, args,
                CRUDLController.prototype, key
            );
        }
    };

    setMethodsParamTypeMeta([
        [ 'list', { 0: ModelFilterDto } ],
        [ 'create', [ ModelCreateDto ] ],
        [ 'retrieve', [ idType ] ],
        [ 'update', [ idType, ModelUpdateDto ] ],
        [ 'delete', [ idType ] ],
    ]);
}

/**
 * Apply a transform function to the input data, if the function
 * is async or not
 *
 * @param transform Transform function
 * @param input Data input to transform
 * @param request Request object
 * @param operation Name of operation, can be 'list', 'create', etc.
 */
export async function applyTransform<
    TransformFunc extends CRUDLTransformInputFunction | CRUDLTransformOutputFunction,
    Operation extends string,
>(
    transform: TransformFunc,
    input: any,
    request: any,
    operation: Operation
) {
    if(transform) {
        if (isAsync(transform))
            return await transform(input, request, operation);
        else
            return transform(input, request, operation);
    }
}
