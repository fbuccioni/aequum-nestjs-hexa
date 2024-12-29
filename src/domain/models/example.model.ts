import { IsNotEmpty } from 'class-validator';


export class Example {
    id: string;

    @IsNotEmpty()
    name: string;

    age: number;

    email: string;
}
