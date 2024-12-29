import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExamplesController } from './controllers/examples.controller';

import { ExamplesService } from '../../services/examples.service';

import { Example, ExampleSchema } from '../../../infrastructure/database/schemas/example.schema';
import { ExampleRepository } from '../../../infrastructure/database/repositories/example.repository';


@Module({
    imports: [
        MongooseModule.forFeature([ { name: Example.name, schema: ExampleSchema } ])
    ],
    providers: [ ExamplesService, ExampleRepository ],
    controllers: [ ExamplesController ],
    exports: [ ExamplesService ],
})
export class ExampleModule {}

