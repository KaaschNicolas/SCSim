import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { AppDataSource } from './../../data-source';
import { Item } from 'src/entity';
import { Injectable } from '@nestjs/common';
import { WorkingStationCapacityContainerDto } from '../dto/workingStationCapacityContainer.dto';

@Injectable()
export class CapacityService {
    public async capacityNew() {
        let capacityNew = new WorkingStationCapacityContainerDto();

        //Items die der BOM Service in DB gespeichert hat abrufen

        const itemRepository = AppDataSource.getRepository(Item);
        const items = await itemRepository.find({
            select: {
                itemNumber: true,
                productionOrder: true,
            },
        });

        //Wenn Produktionsauftrag >0 wird für jedes Item die Informationen aus den Stammdate zum jeweiligen Produktionsprozess exportiert
        items.forEach(async (item) => {
            if (item.productionOrder <= 0) {
            } else {
                const productionProcessRepository = AppDataSource.getRepository(ProductionProcess);
                let productionProcesses = await productionProcessRepository.findBy({
                    itemId: item.itemNumber,
                });
                //Hier werden die jeweiligen Zeiten für die einzelnen Produktionsaufträge den Arbeitsstationen hinzugefügt
                productionProcesses.forEach((productionProcess) => {
                    capacityNew[productionProcess.workingStationId - 1].addCapacityForItem(
                        productionProcess.itemId,
                        item.productionOrder,
                        productionProcess.processingTime * item.productionOrder,
                        productionProcess.setupTime,
                    );
                });
            }
        });
        return capacityNew;
    }
    public capacityPrev(): void {}
}
