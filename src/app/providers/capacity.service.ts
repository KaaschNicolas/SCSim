import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { Repository, EntityManager } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { WorkingStationCapacityContainerDto } from '../dto/workingStationCapacityContainer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';
import { Item } from 'src/entity/item.entity';
import { WorkingStation } from 'src/entity/workingStation.entity';

@Injectable()
export class CapacityService {
    private readonly logger;

    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(ProductionProcess)
        private readonly productionProcessRepository: Repository<ProductionProcess>,
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        @InjectRepository(WorkingStation)
        private readonly workingStationRepository: Repository<WorkingStation>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(CapacityService.name);
    }

    public async create() {
        let capacityContainer = new WorkingStationCapacityContainerDto();

        this.logger.log('CapacityService: create()');
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
                    item: item,
                });
                //Hier werden die jeweiligen Zeiten für die einzelnen Produktionsaufträge den Arbeitsstationen hinzugefügt
                productionProcesses.forEach((productionProcess) => {
                    capacityContainer[productionProcess.workingStation.number - 1].addCapacityForProductionOrder(
                        productionProcess.item.itemNumber,
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
        this.logger.log('CapacityService: capacityWaitingList()');
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
                        item: await this.itemRepository.findOne({
                            where: { itemNumber: waitingList.itemId },
                        }),
                        workingStation: await this.workingStationRepository.findOne({
                            where: { number: waitingList.workingStationId },
                        }),
                    },
                }),
                waitingList.timeNeed,
            );
        });
        return await this.capacityOrdersInWork(capacityContainer);
    }
    public async capacityOrdersInWork(capacityContainer: WorkingStationCapacityContainerDto) {
        this.logger.log('CapacityService: capacityOrdersInWork()');

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
                            item: await this.itemRepository.findOne({
                                where: { itemNumber: orderInWork.itemId },
                            }),
                            workingStation: await this.workingStationRepository.findOne({
                                where: { number: orderInWork.workingStationId },
                            }),
                        },
                    }),
                )
            ).forEach(async (productionProcess) => {
                capacityContainer[productionProcess.workingStation.number - 1].addCapacityOrdersInWork(
                    productionProcess.item.itemNumber,
                    orderInWork.amount,
                    productionProcess.setupTime,
                    productionProcess.processingTime * orderInWork.amount,
                );
            });
        });
        capacityContainer.workingStationCapacities.forEach(capacity => {
            capacity.calculateTotalCapacity();
            capacity.calculateTotalShiftsAndOvertime();
        });
        return capacityContainer;
    }
}
