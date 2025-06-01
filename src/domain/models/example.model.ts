import { IsMongoId, IsString, IsNumber, IsNotEmpty } from 'class-validator';


export class Example {
    @IsMongoId()
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsString()
    breed?: string;
}
