import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { PurchasedItem } from './purchasedItem.entity';

@Entity()
export class ItemPurchasedItem {
    @PrimaryColumn()
    public id: number;

    @ManyToOne(() => Item, (item) => item.itemPurchasedItems)
    public item: Item;

    @ManyToOne(() => PurchasedItem, (purchasedItem) => purchasedItem.itemPurchasedItems)
    public purchasedItem: PurchasedItem;

    @Column()
    public multiplier: number;
}
