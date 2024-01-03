import {
    Entity,
    Column,
    PrimaryColumn,
    Tree,
    TreeChildren,
    TreeParent,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { PurchasedItem } from './purchasedItem.entity';
import { ProductionProcess } from './productionProcess.entity';
import { ItemPurchasedItem } from './itemPurchasedItem.entity';

@Entity()
export class Item {
    @PrimaryColumn()
    public itemNumber: number;

    @Column()
    public safetyStock: number;

    @Column()
    public warehouseStock: number;

    @Column()
    public waitingQueue?: number;

    @Column()
    public workInProgress?: number;

    @Column()
    public productionOrder?: number;

    @Column()
    public isMultiple?: boolean;

    @OneToMany(() => Item, (item) => item.parentItem)
    public consistsOf: Item[];

    @ManyToOne(() => Item, (item) => item.consistsOf)
    public parentItem: Item;

    @OneToMany(() => ProductionProcess, (productionProcess) => productionProcess.item)
    public productionProcesses: ProductionProcess[];

    @OneToMany(() => ItemPurchasedItem, (itemPurchasedItem) => itemPurchasedItem.item)
    public itemPurchasedItems: ItemPurchasedItem[];

    constructor(item: Partial<Item>) {
        Object.assign(this, item);
    }
}
