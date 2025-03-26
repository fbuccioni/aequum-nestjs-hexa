import { Schema, SchemaOptions } from 'mongoose';


type TransformMethods = 'toObject' | 'toJSON';

export function schemaTransformsForVirtualID<TClass = any>(
    schema: Schema<TClass>,
    toJSONOptions?: SchemaOptions['toJSON'],
    toObjectOptions?: SchemaOptions['toObject'],
    removeVersion = true
): Schema<TClass> {
    const transformOptions: Array<
        [TransformMethods, SchemaOptions[TransformMethods]]
    > = [
        ['toObject', toJSONOptions || {}],
        ['toJSON', toObjectOptions || {}],
    ];

    Object.defineProperty(schema, '__hasVirtualID__', {
        value: true,
        writable: false,
        enumerable: false
    });

    for (const [key, options] of transformOptions)
        schema.set(
            key,
            Object.assign({}, options, {
                virtuals: true,
                transform: (doc: any, ret: any, opt: any) => {
                    if (typeof options?.transform === 'function')
                        options?.transform(doc, ret, opt);

                    delete ret._id;

                    if (removeVersion)
                        delete ret.__v;
                },
            })
        );

    return schema;
}
