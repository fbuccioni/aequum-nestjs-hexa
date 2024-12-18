import { DataSource, DataSourceOptions } from 'typeorm';

import typeORMConfiguration from './typeorm.config';


const typeORMDataSource = new DataSource(typeORMConfiguration as DataSourceOptions);
export default typeORMDataSource;
