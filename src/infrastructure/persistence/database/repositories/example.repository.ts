import { Injectable } from '@nestjs/common';
import { Model, RootFilterQuery } from 'mongoose';
import { Example, ExampleSchema } from '../schemas/example.schema';
import { MongooseRepository } from 'src/shared/common/repositories/mongoose.repository';
import { InjectModel } from '@nestjs/mongoose';


export type ExampleQueryFilter = RootFilterQuery<Example>;

@Injectable()
export class ExampleRepository extends MongooseRepository<Example> {
    constructor(@InjectModel(Example.name) protected model: Model<Example>) {
        super();
    }
}
