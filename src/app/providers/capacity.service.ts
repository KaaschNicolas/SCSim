import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { Repository, EntityManager } from 'typeorm';
import { Item } from 'src/entity';
import { Injectable } from '@nestjs/common';
import { WorkingStationCapacityContainerDto } from '../dto/workingStationCapacityContainer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';

@Injectable()
export class CapacityService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(ProductionProcess)
        private readonly productionProcessRepository: Repository<ProductionProcess>,
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        private readonly entityManager: EntityManager,
    ) {}

    public async create() {
        let capacityContainer = new WorkingStationCapacityContainerDto();

        //Items die der BOM Service in DB gespeichert hat abrufen

        const items = await this.itemRepository.find({
            select: {
                itemNumber: true,
                productionOrder: true,
            },
        });

        //Wenn Produktionsauftrag >0 wird für jedes Item die Informationen aus den Stammdate zum jeweiligen Produktionsprozess exportiert
        items.forEach(async (item) => {
            if (item.productionOrder <= 0) {
            } else {
                const productionProcesses = await this.productionProcessRepository.findBy({
                    itemId: item.itemNumber,
                });
                //Hier werden die jeweiligen Zeiten für die einzelnen Produktionsaufträge den Arbeitsstationen hinzugefügt
                productionProcesses.forEach((productionProcess) => {
                    capacityContainer[productionProcess.workingStationId - 1].addCapacityForProductionOrder(
                        productionProcess.itemId,
                        item.productionOrder,
                        productionProcess.setupTime,
                        productionProcess.processingTime * item.productionOrder,
                    );
                });
            }
        });
        return await this.capacityWaitingList(capacityContainer);
    }
    public async capacityWaitingList(capacityContainer: WorkingStationCapacityContainerDto) {
        const waitingLists = await this.waitingListRepository.find({
            where: {
                isInWork: false,
            },
        });
        waitingLists.forEach(async (waitingList) => {
            capacityContainer[waitingList.workingStationId - 1].addCapacityForWaitingList(
                waitingList.itemId,
                waitingList.amount,
                await this.productionProcessRepository.find({
                    select: {
                        setupTime: true,
                    },
                    where: {
                        itemId: waitingList.itemId,
                        workingStationId: waitingList.workingStationId,
                    },
                }),
                waitingList.timeNeed,
            );
        });
        return await this.capacityOrdersInWork(capacityContainer);
    }
    public async capacityOrdersInWork(capacityContainer: WorkingStationCapacityContainerDto) {
        await (
            await this.waitingListRepository.find({
                where: {
                    isInWork: true,
                },
            })
        ).forEach(async (orderInWork) => {
            capacityContainer[orderInWork.workingStationId - 1].addCapacityOrdersInWork(
                orderInWork.itemId,
                orderInWork.amount,
                0,
                orderInWork.timeNeed,
            );
            await (
                await this.entityManager.getTreeRepository(ProductionProcess).findDescendants(
                    await this.productionProcessRepository.findOne({
                        where: {
                            itemId: orderInWork.itemId,
                            workingStationId: orderInWork.workingStationId,
                        },
                    }),
                )
            ).forEach(async (productionProcess) => {
                capacityContainer[productionProcess.workingStationId - 1].addCapacityOrdersInWork(
                    productionProcess.itemId,
                    orderInWork.amount,
                    productionProcess.setupTime,
                    productionProcess.processingTime * orderInWork.amount,
                );
            });
        });
        return capacityContainer;
    }
}
