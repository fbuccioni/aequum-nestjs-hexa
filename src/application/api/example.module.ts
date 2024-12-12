import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExampleService } from '../services/example.service';
import { ExampleController } from '../controllers/example.controller';
import { Example } from '../../infrastructure/persistence/database/entities/example.entity';


@Module({
    imports: [ TypeOrmModule.forFeature([ Example ]) ],
    providers: [ ExampleService ],
    controllers: [ ExampleController ],
    exports: [ ExampleService ],
})
export class ExampleModule {}
