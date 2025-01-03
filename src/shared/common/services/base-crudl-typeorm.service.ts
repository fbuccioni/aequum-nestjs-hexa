import { BaseCRUDLService } from "./base-crudl.service";
import { TypeORMRepository } from '../repository/type-orm.repository';
import { duplicateEntryExceptionOrError } from '../utils/typeorm.utils';


export abstract class BaseCRUDLTypeORMService<
    EntityModel extends { id: string | number },
    EntityModelDto,
    EntityModelCreateDto,
    EntityModelUpdateDto
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

    protected readonly repository: TypeORMRepository<EntityModel>

    async create(data: EntityModelCreateDto): Promise<EntityModelDto> {
        const self = this.constructor as typeof BaseCRUDLTypeORMService;

        try {
            const ormModel = this.repository.create(data as any);
            return this.repository.save(ormModel) as unknown as Promise<EntityModelDto>;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            )
        }
    }

    async retrieve(id: EntityModel['id']): Promise<EntityModelDto> {
        return this.repository.findOneBy({ id: id as any }) as unknown as Promise<EntityModelDto>;
    }

    async update(id: EntityModel['id'], data: EntityModelUpdateDto): Promise<EntityModelDto> {
        const self = this.constructor as typeof BaseCRUDLTypeORMService;

        try {
            await this.repository.update(id, data as any);
            return this.retrieve(id);
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    async delete(id: EntityModel['id']): Promise<void> {
        await this.repository.delete(id);
    }

    async list(filter?: any): Promise<EntityModelDto[]> {
        return this.repository.find(filter) as unknown as Promise<EntityModelDto[]>;
    }
}
