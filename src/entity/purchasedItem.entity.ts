import { Entity, PrimaryColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { ItemPurchasedItem } from './itemPurchasedItem.entity';
import { FutureOrder } from './futureOrder.entity';

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

    @Column('decimal', { precision: 6, scale: 1 })
    public deliverytime: number;

    @Column('decimal', { precision: 6, scale: 1 })
    public deviation: number;

    @Column()
    discountQuantity: number;

    @Column()
    public descriptionProductionOrder: string;

    @Column()
    public descriptionWaitingList: string;

    @OneToMany(() => ItemPurchasedItem, (itemPurchasedItem) => itemPurchasedItem.purchasedItem)
    public itemPurchasedItems: ItemPurchasedItem[];

    @OneToMany(() => FutureOrder, (futureOrder) => futureOrder.purchasedItem)
    public futureOrder: FutureOrder[];

    constructor(item: Partial<PurchasedItem>) {
        Object.assign(this, item);
    }
}
