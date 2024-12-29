import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';

import { ExampleRepository } from '../../infrastructure/database/repositories/example.repository';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../dtos';


@Injectable()
export class ExamplesService {
    constructor(private readonly exampleRepository: ExampleRepository) {}

    async get(id: string): Promise<ExampleDto> {
        return this.exampleRepository.getOneById(
            new mongoose.Types.ObjectId(id)
        ) as unknown as Promise<ExampleDto>;
    }

    async list(filter?: {}): Promise<ExampleDto[]> {
        return this.exampleRepository.find(filter) as unknown as Promise<
            ExampleDto[]
        >;
    }

    async new(exampleCreateDto: ExampleCreateDto): Promise<ExampleDto> {
        return this.exampleRepository.put(
            exampleCreateDto
        ) as unknown as Promise<ExampleDto>;
    }

    async update(id: string, exampleUpdateDto: ExampleUpdateDto) {
        await this.exampleRepository.update(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: exampleUpdateDto }
        );
    }

    async delete(id) {
        await this.exampleRepository.delete({
            _id: new mongoose.Types.ObjectId(id),
        });
    }
}
