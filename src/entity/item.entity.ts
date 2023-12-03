import {
    Entity,
    Column,
    PrimaryColumn,
    Tree,
    TreeChildren,
    TreeParent,
    JoinTable,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { PurchasedItem } from './purchasedItem.entity';
import { ProductionProcess } from './productionProcess.entity';

@Entity()
@Tree('nested-set')
export class Item {
    @PrimaryColumn()
    public itemNumber: number;

    @Column()
    public safetyStock: number;

    @Column()
    public warehouseStock: number;

    @Column()
    public waitingQueue: number;

    @Column()
    public workInProgress: number;

    @Column()
    public productionOrder?: number;

    @Column()
    public isMultiple?: boolean;

    @TreeChildren()
    public consistsOf: Item[];

    @TreeParent()
    public parentItem: Item;

    @OneToMany(() => ProductionProcess, (productionProcess) => productionProcess.item)
    public productionProcesses: ProductionProcess[];

    @ManyToMany(() => PurchasedItem, (purchasedItem) => purchasedItem.items)
    @JoinTable()
    public purchasedItems: PurchasedItem[];
}
