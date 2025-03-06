/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SwaggerExplorer } from "@nestjs/swagger/dist/swagger-explorer";


type GenerateDenormalizedDocument = (
    document: any[],
    metatype: any,
    prototype: any,
    instance: any,
    documentResolvers: any,
    applicationConfig: any,
    options: any
) => any;

/**
 * Patch the document by monkey patching the `SwaggerExplorer` class in the
 * method `generateDenormalizedDocument`.
 *
 * @param generateDenormalizedDocument
 */
export function patchDocumentViaSwaggerExplorer(generateDenormalizedDocument: GenerateDenormalizedDocument) {
    // @ts-ignore
    const oldfn = SwaggerExplorer.prototype.generateDenormalizedDocument;

    // @ts-ignore
    SwaggerExplorer.prototype.generateDenormalizedDocument = function(...args: any[]) {
        return generateDenormalizedDocument.call(
            this,
            oldfn.apply(this, args),
            ...args
        );
    }
}
