import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    ParseUUIDPipe,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExampleCreateDto, ExampleDto, ExampleUpdateDto } from '../../../dtos';
import { Example } from '../../../../domain/models/example.model';
import { ExampleService } from '../../../services/example.service';


@ApiTags('Example')
@Controller('examples')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new example' })
    @ApiResponse({
        status: 201,
        description: 'The example has been successfully created.',
        type: ExampleDto,
    })
    @HttpCode(201)
    async create(@Body() body: ExampleCreateDto): Promise<ExampleDto> {
        return this.exampleService.new(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all examples' })
    @ApiResponse({
        status: 200,
        description: 'List of examples retrieved successfully.',
        type: [ExampleDto],
    })
    async list(): Promise<ExampleDto[]> {
        return this.exampleService.list(null);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a example by ID' })
    @ApiResponse({
        status: 200,
        description: 'Example retrieved successfully.',
        type: ExampleDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Example not found.',
    })
    async retrieve(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<Example> {
        return this.exampleService.get(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a example by ID' })
    @ApiResponse({
        status: 200,
        description: 'The example has been successfully updated.',
        type: ExampleDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Example not found.',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: ExampleUpdateDto
    ): Promise<ExampleDto> {
        await this.exampleService.update(id, body);
        return this.exampleService.get(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a example by ID' })
    @ApiResponse({
        status: 204,
        description: 'The example has been successfully deleted.',
    })
    @ApiResponse({
        status: 404,
        description: 'Example not found.',
    })
    @HttpCode(204)
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.exampleService.delete(id);
    }
}
