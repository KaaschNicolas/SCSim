import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class PurchasedItem {
    @PrimaryColumn()
    public number: number;

    @Column()
    public ordertype: number;

    @Column()
    public costs: number;

    @Column()
    public calculatedPurchase: number;

    @ManyToMany(() => Item, (item) => item.purchasedItems)
    public items: Item[];
}
