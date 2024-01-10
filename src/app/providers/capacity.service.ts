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
        const items = await this.itemRepository.find({
            select: {
                itemNumber: true,
                productionOrder: true,
            },
        });

        for (const item of items) {
            if (item.productionOrder > 0) {
                const productionProcesses = await this.productionProcessRepository.find({
                    where: [{item: item}],
                    relations: { 
                        workingStation: true,
                        item: true, 
                    }
                });

                for (const productionProcess of productionProcesses) {
                    capacityContainer.workingStationCapacities[productionProcess.workingStation.number - 1].addCapacityForProductionOrder(
                        productionProcess.item.itemNumber,
                        item.productionOrder,
                        productionProcess.setupTime,
                        productionProcess.processingTime * item.productionOrder,
                    );
                }
            }
        }

        return capacityContainer;
    }

    public async capacityWaitingList(capacityContainer: WorkingStationCapacityContainerDto) {
        this.logger.log('CapacityService: capacityWaitingList()');
        const waitingLists = await this.waitingListRepository.find({
            where: {
                isInWork: false,
            },
        });
        for (const waitingList of waitingLists) {
            const item = await this.itemRepository.findOne({
                where: { itemNumber: waitingList.itemId },
            });
            const workingStation = await this.workingStationRepository.findOne({
                where: { number: waitingList.workingStationId },
            });
            const productionProcess = await this.productionProcessRepository.find({
                select: {
                    setupTime: true,
                },
                where: {
                    item: item,
                    workingStation: workingStation,
                },
                relations: {
                    workingStation: true,
                    item: true,
                },
            });

            capacityContainer.workingStationCapacities[waitingList.workingStationId - 1].addCapacityForWaitingList(
                waitingList.itemId,
                waitingList.amount,
                productionProcess[0].setupTime,
                waitingList.timeNeed,
            );
        }

        return capacityContainer;
    }

    public async capacityOrdersInWork(capacityContainer: WorkingStationCapacityContainerDto) {
        this.logger.log('CapacityService: capacityOrdersInWork()');
        const ordersInWork = await this.waitingListRepository.find({
            where: {
                isInWork: true,
            },
        });

        for (const orderInWork of ordersInWork) {
            const ppItem = await this.itemRepository.findOne({
                where: { itemNumber: orderInWork.itemId },
            });
            const ppWorkingStation = await this.workingStationRepository.findOne({
                where: { number: orderInWork.workingStationId },
            });
            const productionProcess = await this.productionProcessRepository.find({
                where: {
                    item: ppItem,
                    workingStation: ppWorkingStation,
                },
                relations: {
                    workingStation: true,
                    item: true,
                },
            });

            const descendants = await this.entityManager.getTreeRepository(ProductionProcess).findDescendants(productionProcess[0], { relations: ['workingStation', 'item'] });
            let checkFirstItem: boolean = true;
            for (const process of descendants) {
                if (checkFirstItem == true) {
                    capacityContainer.workingStationCapacities[process.workingStation.number - 1].addCapacityOrdersInWork(
                        process.item.itemNumber,
                        orderInWork.amount,
                        0,
                        orderInWork.timeNeed,
                    );
                    checkFirstItem = false;
                } else {
                    capacityContainer.workingStationCapacities[process.workingStation.number - 1].addCapacityOrdersInWork(
                        process.item.itemNumber,
                        orderInWork.amount,
                        process.setupTime,
                        process.processingTime * orderInWork.amount
                    );
                }

            }
        }

        capacityContainer.workingStationCapacities.forEach(capacity => {
            capacity.calculateTotalCapacity();
            capacity.calculateTotalShiftsAndOvertime();
        });

        return capacityContainer;
    }
}
