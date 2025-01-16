import { MongooseRepository } from "../repositories/mongoose.repository";
import { duplicateEntryExceptionOrError } from '../utils/mongoose.util';

import { BaseCRUDLService } from "./base-crudl.service";


export abstract class BaseCRUDLMongooseService<
    SchemaModel extends { [key in PrimaryKeyField]: any },
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto,
    QueryFilter extends any = any,
    PrimaryKeyField extends string = 'id',
> extends BaseCRUDLService implements BaseCRUDLService {
    protected primaryKeyField: string = '_id';

    static uniqueFields: string[];
    static duplicatedEntryMessage?: string;

    static duplicateEntryExceptionMessage() {
        const self = this;

        if (self.duplicatedEntryMessage)
            return self.duplicatedEntryMessage;

        if (this.uniqueFields && this.uniqueFields?.length)
            return `\`${ self.uniqueFields.join('` or ') }\` already exists`;

        return 'Duplicated entry';
    }

    protected readonly repository: MongooseRepository<SchemaModel>

    async create(data: SchemaModelCreateDto): Promise<SchemaModelDto> {
        const self = this.constructor as typeof BaseCRUDLMongooseService;

        try {
            return this.repository.put(data as unknown as SchemaModel) as SchemaModelDto;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            )
        }
    }

    async retrieve(id: SchemaModel[PrimaryKeyField]): Promise<SchemaModelDto> {
        return this.repository.getOneById(id) as SchemaModelDto;
    }

    async retrieveBy(filter: QueryFilter): Promise<SchemaModelDto> {
        return this.repository.getOne(filter) as SchemaModelDto;
    }

    async update(id: SchemaModel[PrimaryKeyField], data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        return this.updateBy(
            { [ this.primaryKeyField ]: id } as QueryFilter,
            data
        );
    }

    async updateBy(filter: QueryFilter, data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        const self = this.constructor as typeof BaseCRUDLMongooseService;

        try {
            await this.repository.update(filter, data);
            const k = await this.retrieveBy(filter) as unknown as SchemaModelDto;
            console.log(k, filter);
            return k;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    async delete(id: SchemaModel[PrimaryKeyField]): Promise<void> {
        return this.deleteBy({ [ this.primaryKeyField ]: id } as QueryFilter);
    }

    async deleteBy(filter: QueryFilter): Promise<void> {
        return this.repository.delete(filter);
    }

    async list(filter?: any): Promise<SchemaModelDto[]> {
        return this.repository.find(filter) as unknown as SchemaModelDto[];
    }
}
