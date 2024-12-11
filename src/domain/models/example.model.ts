import { IsNotEmpty } from 'class-validator';


export class Example {
    _id: string;

    @IsNotEmpty()
    name: string;

    age: number;

    email: string;
}
