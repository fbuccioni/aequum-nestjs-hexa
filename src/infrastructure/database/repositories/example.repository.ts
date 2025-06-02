import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseRepository } from '@aequum/mongoose/repositories';

import { Example } from '../schemas/example.schema';


@Injectable()
export class ExampleRepository extends MongooseRepository<Example> {
    constructor(@InjectModel(Example.name) protected model: Model<Example>) {
        super();
    }
}
