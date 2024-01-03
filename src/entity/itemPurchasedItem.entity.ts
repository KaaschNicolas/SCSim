import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { PurchasedItem } from './purchasedItem.entity';

@Entity()
export class ItemPurchasedItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Item, (item) => item.itemPurchasedItems)
    public item: Item;

    @ManyToOne(() => PurchasedItem, (purchasedItem) => purchasedItem.itemPurchasedItems)
    public purchasedItem: PurchasedItem;

    @Column()
    public multiplier: number;

    constructor(itemPurchasedItem: Partial<ItemPurchasedItem>) {
        Object.assign(this, itemPurchasedItem);
    }
}
