import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from '../../../infrastructure/database/entities/example.entity';

import { ExamplesService } from '../../services/examples.service';

import { ExampleController } from './controllers/example.controller';


@Module({
    imports: [ TypeOrmModule.forFeature([ Example ]) ],
    providers: [ ExamplesService ],
    controllers: [ ExampleController ],
    exports: [ ExamplesService ],
})
export class ExampleModule {}
