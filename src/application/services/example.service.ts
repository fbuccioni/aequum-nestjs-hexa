import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExampleRepository } from '../../infrastructure/persistence/database/repositories/example.repository';
import { Example } from '../../infrastructure/persistence/database/entities';
import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../dtos';


@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(Example)
        private readonly exampleRepository: ExampleRepository
    ) {}

    async get(id: string): Promise<ExampleDto> {
        return this.exampleRepository.findOneBy({
            id,
        }) as unknown as Promise<ExampleDto>;
    }

    async list(where: any = null): Promise<ExampleDto[]> {
        return this.exampleRepository.find(where) as unknown as Promise<
            ExampleDto[]
        >;
    }

    async new(exampleCreateDto: ExampleCreateDto): Promise<ExampleDto> {
        const ormModel = this.exampleRepository.create(exampleCreateDto);
        return this.exampleRepository.save(
            ormModel
        ) as unknown as Promise<ExampleDto>;
    }

    async update(
        id: string,
        exampleUpdateDto: ExampleUpdateDto
    ): Promise<ExampleDto> {
        await this.exampleRepository.update(id, exampleUpdateDto);
        return this.get(id);
    }

    async delete(id: string) {
        await this.exampleRepository.delete(id);
    }
}
