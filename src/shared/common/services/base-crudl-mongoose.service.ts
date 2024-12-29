import { MongooseRepository } from "../repositories/mongoose.repository";
import { BaseCRUDLService } from "./base-crudl.service";


export abstract class BaseCRUDLMongooseService<
    SchemaModel extends { id: unknown },
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto
> extends BaseCRUDLService implements BaseCRUDLService {
    protected readonly repository: MongooseRepository<SchemaModel>

    async create(data: SchemaModelCreateDto): Promise<SchemaModelDto> {
        return this.repository.put(data as unknown as SchemaModel) as SchemaModelDto;
    }

    async retrieve(id: SchemaModel['id']): Promise<SchemaModelDto> {
        return this.repository.getOneById(id) as SchemaModelDto;
    }

    async update(id: SchemaModel['id'], data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        await this.repository.update({ _id: id }, data);
        return this.retrieve(id) as unknown as SchemaModelDto;
    }

    async delete(id: SchemaModel['id']): Promise<void> {
        return this.repository.delete({ _id: id });
    }

    async list(filter?: any): Promise<SchemaModelDto[]> {
        return this.repository.find(filter) as unknown as SchemaModelDto[];
    }
}
