// noinspection ES6PreferShortImport

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from '../../../infrastructure/database/entities/example.entity';
import { ExamplesService } from '../../services/examples.service';
import { ExamplesController } from './controllers/examples.controller';


@Module({
    imports: [ TypeOrmModule.forFeature([ Example ]) ],
    providers: [ ExamplesService ],
    controllers: [ ExamplesController ],
    exports: [ ExamplesService ],
})
export class ExampleModule {}
