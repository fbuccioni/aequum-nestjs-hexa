import { HydratedDocument } from 'mongoose';
import paginate from "mongoose-paginate-v2";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { VirtualID } from "../../../shared/nestjs/common/decorators/mongoose.decorator";
import { schemaTransformsForVirtualID } from "../../../shared/nestjs/common/utils/mongoose.util";


@Schema()
export class Example {
    // To use `id` instead of `_id` in the response
    @VirtualID()
    id: string

    @Prop({ required: true })
    name: string;

    @Prop()
    age: number;

    @Prop()
    breed: string;
}


export type ExampleDocument = HydratedDocument<Example>;

// Enforce the use of `id` instead of `_id` with `schemaTransformsForVirtualID`
export const ExampleSchema = schemaTransformsForVirtualID(
    SchemaFactory.createForClass(Example)
);

// Enable paginate plugin
ExampleSchema.plugin(paginate);
