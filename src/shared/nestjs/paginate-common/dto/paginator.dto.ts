import { ApiProperty } from "@nestjs/swagger";


export class PaginatorDto {
    @ApiProperty({
        description: 'Page number',
        example: 1,
        default: 1
    })
    page: number;

    @ApiProperty({
        description: 'Size of the page',
        example: 10,
        default: 10
    })
    size: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 1,
    })
    pages: number;

    @ApiProperty({
        description: 'Next page number',
        example: 2,
        default: null
    })
    next: number | null;

    @ApiProperty({
        description: 'Previous page number',
        example: null,
        default: null
    })
    prev: number | null;

    @ApiProperty({
        description: 'Total number of items',
        example: 10,
        default: 10
    })
    total: number;
}
