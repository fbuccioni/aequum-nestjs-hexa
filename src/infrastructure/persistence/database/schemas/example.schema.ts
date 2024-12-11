import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


@Schema()
export class Example {
    @Prop({ required: true })
    name: string;

    @Prop()
    age: number;

    @Prop()
    breed: string;
}


export type ExampleDocument = HydratedDocument<Example>;
export const ExampleSchema = SchemaFactory.createForClass(Example);
