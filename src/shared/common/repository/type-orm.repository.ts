import { DataSource, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export class TypeORMRepository<Model> extends Repository<Model> {
    constructor(target: EntityTarget<Model>, dataSource: DataSource) {
        super(target, dataSource.createEntityManager());
    }
}
