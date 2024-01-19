import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { PurchasedItem } from './purchasedItem.entity';

@Entity()
export class FutureOrder {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public orderPeriod: number;

    @Column()
    public mode: number;

    @ManyToOne(() => PurchasedItem, (purchasedItem) => purchasedItem.futureOrder)
    public purchasedItem: PurchasedItem;

    @Column()
    public amount: number;

    constructor(futureOrder: Partial<FutureOrder>) {
        Object.assign(this, futureOrder);
    }
}
