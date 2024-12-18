import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExampleService } from '../../services/example.service';
import { ExampleController } from './controllers/example.controller';
import { Example, ExampleSchema } from '../../../infrastructure/database/schemas/example.schema';
import { ExampleRepository } from 'src/infrastructure/database/repositories/example.repository';


@Module({
    imports: [
        MongooseModule.forFeature([ { name: Example.name, schema: ExampleSchema } ])
    ],
    providers: [ ExampleService, ExampleRepository ],
    controllers: [ ExampleController ],
    exports: [ ExampleService ],
})
export class ExampleModule {}
