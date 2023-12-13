import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, TreeChildren } from 'typeorm';
import { Item } from './item.entity';
import { WorkingStation } from './workingStation.entity';

/**
 ** Diese Entity dient als Brückentabelle zwischen Item und workingStation mit custom properties um Informationen wie Bearbeitungszeit und Rüstzeit zu Bererechnen
 */

@Entity()
export class ProductionProcess {
    @PrimaryGeneratedColumn()
    public productionprocessId: number;

    @Column()
    public itemId: number;

    @Column()
    public workingStationId: number;

    @Column()
    public setupTime: number;

    @Column()
    public processingTime: number;

    @TreeChildren()
    public children: ProductionProcess;

    @ManyToOne(() => Item, (item) => item.productionProcesses)
    public item: Item;

    @ManyToOne(() => WorkingStation, (workingStation) => workingStation.productionProcesses)
    public workingStation: WorkingStation;

    constructor(item: Partial<ProductionProcess>) {
        Object.assign(this, item);
    }
}
