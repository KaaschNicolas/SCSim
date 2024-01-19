import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { PurchasedItem } from './purchasedItem.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public mode: number;

    @ManyToOne(() => PurchasedItem, (purchasedItem) => purchasedItem.order)
    public purchasedItem: PurchasedItem;

    @Column()
    public amount: number;

    @Column()
    public daysAfterToday: number;

    constructor(order: Partial<Order>) {
        Object.assign(this, order);
    }
}
