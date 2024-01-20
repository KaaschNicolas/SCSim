import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, TreeChildren, TreeParent, Tree } from 'typeorm';

@Entity()
export class ProductionProgram {
    @PrimaryGeneratedColumn()
    public productionProgramId: number;

    @Column()
    public period: number;

    @Column()
    public amountP1: number;

    @Column()
    public amountP2: number;

    @Column()
    public amountP3: number;
}
