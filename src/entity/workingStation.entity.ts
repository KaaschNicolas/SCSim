import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { ProductionProcess } from './productionProcess.entity';

@Entity()
export class WorkingStation {
    @PrimaryColumn()
    public number: number;

    @OneToMany(() => ProductionProcess, (productionProcess) => productionProcess.workingStation)
    public productionProcesses: ProductionProcess[];
}
