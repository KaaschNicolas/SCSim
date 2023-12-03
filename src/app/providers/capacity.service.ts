import { ProductionProcess } from "src/entity/productionProcess.entity";
import { AppDataSource } from "./../../data-source"
import { Item, WorkingStation } from "src/entity";
import { Injectable } from "@nestjs/common";
import { CapacityForItemDto } from "../dto";
import { WorkingStationCapacityContainerDto, WorkkingStationCapacityContainer } from "../dto/workingStationCapacityContainer.dto";

@Injectable()

export class CapacityService {

    public async capacityNew(): WorkkingStationCapacityContainer {

        const capacityNew = new WorkingStationCapacityContainerDto();

        //Items die der BOM Service in DB gespeichert hat abrufen
        
        const itemRepository = AppDataSource.getRepository(Item);
        const items = await itemRepository.find({
            select: {
                itemNumber: true,
                productionOrder: true,
            },
        })
        
       
       //Wenn Produktionsauftrag >0 wird für jedes Item die Informationen aus den Stammdate zum jeweiligen Produktionsprozess exportiert
        items.forEach(item => {
            if (item.productionOrder <= 0){
                continue;
            } else {
                const productionProcessRepository = AppDataSource.getRepository(ProductionProcess);
                const productionProcesses = await productionProcessRepository.findBy({
                    itemId: item.itemNumber,
                })
                //Hier werden die jeweiligen Zeiten für die einzelnen Produktionsaufträge den Arbeitsstationen hinzugefügt
                productionProcesses.forEach(productionProcess => {
                    capacityNew[productionProcess.workingStationId - 1].addCapacityForItem(
                        productionProcess.itemId,
                        item.productionOrder,
                        productionProcess.processingTime * item.productionOrder,
                        productionProcess.setupTime
                    )
                })
            }
        })
        return capacityNew;
    }
    public loadProductionProcesses (itemNumber) : pro
    public capacityPrev(): void {}
    
}
