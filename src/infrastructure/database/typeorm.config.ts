import { EntitySchema } from 'typeorm';
import { env } from '@aequum/utils';
import { URIToDataSourceOptions } from '@aequum/typeorm/utils';
import { module as moduleUtils } from '@aequum/nestjs-common/utils';

import * as Entities from './entities';


env.load()

const migrationsDir = `${__dirname}/migrations`;
const typeORMConfiguration = {
    ...URIToDataSourceOptions(process.env.DATABASE_MAIN_URI),
    synchronize: env.asBoolean(process.env.DATABASE_MAIN_SYNCHRONIZE),
    entities: moduleUtils.toFlattenArray(Entities) as EntitySchema[],
    logging: env.asBoolean(process.env.DATABASE_MAIN_LOGGING),
    cli: { migrationsDir }
}

// When synchronize is not explicitly set, fall into migration
if (!typeORMConfiguration.synchronize)
    Object.assign(typeORMConfiguration, {
        migrations : [ `${migrationsDir}/**/*.ts` ],
        migrationsTableName: 'typeorm_migrations',
        migrationsRun: env.asBoolean(process.env.DATABASE_MAIN_MIGRATIONS_AUTO),
    });

export default typeORMConfiguration;
