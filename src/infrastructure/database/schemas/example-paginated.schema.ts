import { HydratedDocument } from 'mongoose';
import paginate from "mongoose-paginate-v2";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { schemaTransformsForVirtualID } from "@aequum/mongoose/utils";
import { VirtualID } from "@aequum/nestjs-mongoose/decorators";

import { Example as ExampleModel } from '../../../domain/models/example.model';


@Schema()
export class Example extends ExampleModel {
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
