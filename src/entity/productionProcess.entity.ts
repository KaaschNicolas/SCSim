import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, TreeChildren, TreeParent, Tree } from 'typeorm';
import { Item } from './item.entity';
import { WorkingStation } from './workingStation.entity';

/**
 ** Diese Entity dient als Brückentabelle zwischen Item und workingStation mit custom properties um Informationen wie Bearbeitungszeit und Rüstzeit zu Bererechnen
 */

@Entity()
@Tree('nested-set')
export class ProductionProcess {
    @PrimaryGeneratedColumn()
    public productionProcessId: number;

    @Column()
    public itemId: number;

    @Column()
    public workingStationId: number;

    @Column()
    public setupTime: number;

    @Column()
    public processingTime: number;

    @TreeChildren()
    children: ProductionProcess[];

    @TreeParent()
    parent: ProductionProcess;

    @ManyToOne(() => Item, (item) => item.productionProcesses)
    public item: Item;

    @ManyToOne(() => WorkingStation, (workingStation) => workingStation.productionProcesses)
    public workingStation: WorkingStation;

    constructor(item: Partial<ProductionProcess>) {
        Object.assign(this, item);
    }
}
