import { Entity, PrimaryColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { ItemPurchasedItem } from './itemPurchasedItem.entity';

@Entity()
export class PurchasedItem {
    @PrimaryColumn()
    public number: number;

    @Column()
    public ordertype: number;

    @Column()
    public costs: number;

    @Column()
    public warehouseStock: number;

    @Column()
    public calculatedPurchase: number;

    @OneToMany(() => ItemPurchasedItem, (itemPurchasedItem) => itemPurchasedItem.purchasedItem)
    public itemPurchasedItems: ItemPurchasedItem[];

    constructor(item: Partial<PurchasedItem>) {
        Object.assign(this, item);
    }
}
