import { MongooseRepository } from "../repositories/mongoose.repository";
import { duplicateEntryExceptionOrError } from '../utils/mongoose.util';

import { BaseCRUDLService } from "./base-crudl.service";


export abstract class BaseCRUDLMongooseService<
    SchemaModel extends { id: unknown },
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto
> extends BaseCRUDLService implements BaseCRUDLService {
    static uniqueFields: string[];
    static duplicatedEntryMessage?: string;

    static duplicateEntryExceptionMessage() {
        const self = this;

        if (self.duplicatedEntryMessage)
            return self.duplicatedEntryMessage;

        if (this.uniqueFields && this.uniqueFields?.length)
            return `\`${self.uniqueFields.join('` or ')}\` already exists`;

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

    async retrieve(id: SchemaModel['id']): Promise<SchemaModelDto> {
        return this.repository.getOneById(id) as SchemaModelDto;
    }

    async update(id: SchemaModel['id'], data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        const self = this.constructor as typeof BaseCRUDLMongooseService;

        try {
            await this.repository.update({ _id: id }, data);
            return this.retrieve(id) as unknown as SchemaModelDto;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    async delete(id: SchemaModel['id']): Promise<void> {
        return this.repository.delete({ _id: id });
    }

    async list(filter?: any): Promise<SchemaModelDto[]> {
        return this.repository.find(filter) as unknown as SchemaModelDto[];
    }
}
