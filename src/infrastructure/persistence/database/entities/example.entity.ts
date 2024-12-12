import { Example as DomainExample } from '../../../../domain/models'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Example extends DomainExample {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    age: number;

    @Column({ length: 128 })
    email: string;
}
