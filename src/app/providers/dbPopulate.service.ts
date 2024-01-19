import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class DbPopulateService {
    constructor(
        @InjectRepository(WorkingStation)
        private readonly workingStationRepository: Repository<WorkingStation>,
        @InjectRepository(ProductionProcess)
        private readonly productionProcessRepository: Repository<ProductionProcess>,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemRepository: Repository<PurchasedItem>,
        @InjectRepository(ItemPurchasedItem)
        private readonly itemPurchasedItemRepository: Repository<ItemPurchasedItem>,
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        private readonly entityManager: EntityManager,
    ) {}

    private async findItem(itemNumber: number): Promise<Item | null> {
        return await this.itemRepository.findOne({ where: { itemNumber } });
    }

    private async updateItemConsistsOf(itemNumber: number, consistsOfNumbers: number[]): Promise<void> {
        const item = await this.findItem(itemNumber);
        if (!item) {
            console.log(`Item not found: ${itemNumber}`);
            return;
        }

        item.consistsOf = await Promise.all(consistsOfNumbers.map((num) => this.findItem(num)));
        await this.itemRepository.save(item);
    }

    public async populate(): Promise<void> {
        console.log('WorkingStationPopulateStarts');
        //if ((await this.workingStationRepository.count()) === 0) {
        const workingStations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        const savePromises = workingStations.map((workingStationNumber) => {
            const workingStation = new WorkingStation({ number: workingStationNumber });
            return this.workingStationRepository.save(workingStation);
        });

        await Promise.all(savePromises);
        //} else {
        //console.log('WorkingStations are already written in DB');
        //}
        console.log('WorkingStationPopulateEnded');
        console.log('ItemPopulateStarts');
        //if ((await this.itemRepository.count()) === 0) {
        await this.fillItems();

        console.log('ItemPopulateEnded');
        console.log('ProuctionProcessStart');

        if ((await this.productionProcessRepository.count()) === 0) {
            await this.fillProductionProcess();
        } else {
            console.log('Production processes are already written in DB');
        }

        console.log('populate ProuctionProcess Ended');
        console.log('PurchasedItemStart');
        if ((await this.purchasedItemRepository.count()) === 0) {
            await this.fillPurchasedItem();
        } else {
            console.log('Purchased Items are already written in DB');
        }
        console.log('PurchasedItemEnded');
        console.log('ItemPurchasedItemStart');
        if ((await this.itemPurchasedItemRepository.count()) === 0) {
            await this.fillItemPurchasedItem();
        } else {
            console.log('ItemPurchasedItems are already written in DB');
        }
        console.log('ItemPurchasedItemEnded');

        await this.resetWaitingList();
        await this.resetPurchasedItem();

        /*         const testItemArray = [1, 51, 50, 49, 2, 56, 55, 54];
        for (const item of testItemArray) {
            console.log(
                await this.entityManager.getTreeRepository(Item).findDescendantsTree(
                    await this.itemRepository.findOne({
                        where: { itemNumber: item },
                    }),
                ),
            );
        } */
    }

    public async fillItems() {
        const itemNumbers = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 161, 162, 163, 171, 172, 173, 18, 19, 20, 261, 262, 263,
            29, 30, 31, 49, 50, 51, 54, 55, 56,
        ];
        for (const itemNumber of itemNumbers) {
            await this.itemRepository.save(
                new Item({
                    itemNumber: itemNumber,
                    safetyStock: 0,
                    warehouseStock: 0,
                    waitingQueue: 0,
                    workInProgress: 0,
                    productionOrder: 0,
                    isMultiple: false,
                }),
            );
        }
        try {
            await this.updateItemConsistsOf(1, [261, 51]);
            await this.updateItemConsistsOf(51, [161, 171, 50]);
            await this.updateItemConsistsOf(50, [4, 10, 49]);
            await this.updateItemConsistsOf(49, [7, 13, 18]);
            await this.updateItemConsistsOf(2, [262, 56]);
            await this.updateItemConsistsOf(56, [162, 172, 55]);
            await this.updateItemConsistsOf(55, [5, 11, 54]);
            await this.updateItemConsistsOf(54, [8, 14, 19]);
            await this.updateItemConsistsOf(3, [263, 31]);
            await this.updateItemConsistsOf(31, [163, 173, 30]);
            await this.updateItemConsistsOf(30, [6, 12, 29]);
            await this.updateItemConsistsOf(29, [9, 15, 20]);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    public async fillProductionProcess() {
        //Stammdaten Enität ProductionProcesses
        const productionProcesses = [
            //P1/finalProduct
            [
                //E13/1/productionStep
                [
                    [13, 9, 3, 15],
                    [13, 7, 2, 20],
                    [13, 8, 1, 15],
                    [13, 12, 3, 0],
                    [13, 13, 2, 0],
                ],
                //E18/2/productionStep
                [
                    [18, 9, 2, 15],
                    [18, 7, 2, 20],
                    [18, 8, 3, 20],
                    [18, 6, 3, 15],
                ],
                //E7/3/productionStep
                [
                    [7, 11, 3, 20],
                    [7, 10, 4, 20],
                ],
                //E4/4
                [
                    [4, 11, 3, 10],
                    [4, 10, 4, 20],
                ],
                //E10/5
                [
                    [10, 9, 3, 15],
                    [10, 7, 2, 20],
                    [10, 8, 1, 15],
                    [10, 12, 3, 0],
                    [10, 13, 2, 0],
                ],
                //E49/6
                [[49, 1, 6, 20]],
                //E17/7
                [[171, 15, 3, 15]],
                //E16/8
                [
                    [161, 14, 3, 0],
                    [161, 6, 2, 15],
                ],
                //E50/9
                [[50, 2, 5, 30]],
                //E51/10
                [[51, 3, 5, 20]],
                //E26/11
                [
                    [261, 15, 3, 15],
                    [261, 7, 2, 30],
                ],
                //P1/12
                [[1, 4, 6, 30]],
            ],
            //productionProcessesP2
            [
                //E14/1
                [
                    [14, 9, 3, 15],
                    [14, 7, 2, 20],
                    [14, 8, 2, 15],
                    [14, 12, 3, 0],
                    [14, 13, 2, 0],
                ],
                //E19/2
                [
                    [19, 9, 2, 20],
                    [19, 7, 2, 20],
                    [19, 8, 3, 25],
                    [19, 6, 3, 15],
                ],
                //E8/3
                [
                    [8, 11, 3, 20],
                    [8, 10, 4, 20],
                ],
                //E54/4
                [[54, 1, 6, 20]],
                //E55/5
                [
                    [5, 11, 3, 10],
                    [5, 10, 4, 20],
                ],
                //E11/6
                [
                    [11, 9, 3, 15],
                    [11, 7, 2, 20],
                    [11, 8, 2, 15],
                    [11, 12, 3, 0],
                    [11, 13, 2, 0],
                ],
                //E17/7
                [[172, 15, 3, 15]],
                //E16/8
                [
                    [162, 14, 3, 0],
                    [162, 6, 2, 15],
                ],
                //E55/9
                [[55, 2, 5, 30]],
                //E56/10
                [[56, 3, 6, 20]],
                //E26/11
                [
                    [262, 15, 3, 15],
                    [262, 7, 2, 30],
                ],
                //P2/12
                [[2, 4, 7, 20]],
            ],
            //productionProcessesP3
            [
                //E15/1/productionStep
                [
                    [15, 9, 3, 15],
                    [15, 7, 2, 20],
                    [15, 8, 2, 15],
                    [15, 12, 3, 0],
                    [15, 13, 2, 0],
                ],
                //E20/2/productionStep
                [
                    [20, 9, 2, 15],
                    [20, 7, 2, 20],
                    [20, 8, 3, 20],
                    [20, 6, 3, 15],
                ],
                //E9/3/productionStep
                [
                    [9, 11, 3, 20],
                    [9, 10, 4, 20],
                ],
                //E29/4/productionStep
                [[29, 1, 6, 20]],
                //E6/5/productionStep
                [
                    [6, 11, 3, 20],
                    [6, 10, 4, 20],
                ],
                //E12/6/productionStep
                [
                    [12, 9, 3, 15],
                    [12, 7, 2, 20],
                    [12, 8, 2, 15],
                    [12, 12, 3, 0],
                    [12, 13, 2, 0],
                ],
                //E17/7/productionStep
                [[173, 15, 3, 15]],
                //E16/8/productionStep
                [
                    [163, 14, 3, 0],
                    [163, 6, 2, 15],
                ],
                //E30/9/productionStep
                [[30, 2, 5, 20]],
                //E31/10/productionStep
                [[31, 3, 6, 20]],
                //E26/11/productionStep
                [
                    [263, 15, 3, 15],
                    [263, 7, 2, 30],
                ],
                //P3/12/productionStep
                [[3, 4, 7, 30]],
            ],
        ];
        for (const finalProduct of productionProcesses) {
            for (const productionStep of finalProduct) {
                let length = productionStep.length;
                let processBefore: ProductionProcess;
                for (let i = length - 1; i > -1; i--) {
                    if (i === length - 1) {
                        const firstProcess = new ProductionProcess({
                            item: await this.itemRepository.findOne({
                                where: { itemNumber: productionStep[i][0] },
                            }),
                            workingStation: await this.workingStationRepository.findOne({
                                where: { number: productionStep[i][1] },
                            }),
                            processingTime: productionStep[i][2],
                            setupTime: productionStep[i][3],
                        });
                        const savedProcess = await this.productionProcessRepository.manager.save(firstProcess);
                        processBefore = savedProcess;
                    } else {
                        const iProcess = new ProductionProcess({
                            item: await this.itemRepository.findOne({
                                where: { itemNumber: productionStep[i][0] },
                            }),
                            workingStation: await this.workingStationRepository.findOne({
                                where: { number: productionStep[i][1] },
                            }),
                            processingTime: productionStep[i][2],
                            setupTime: productionStep[i][3],
                            parent: processBefore,
                        });
                        const savedProcess = await this.productionProcessRepository.manager.save(iProcess);
                        processBefore = savedProcess;
                    }
                }
            }
        }
    }
    public async fillPurchasedItem() {
        const purchasedItemNumbers = [
            [21,1.8,0.4,300],
            [22,1.7,0.4,300],
            [23,1.2,0.2,300],	
            [24,3.2,0.3,6100],
            [25,0.9,0.2,3600],
            [27,0.9,0.2,1800],
            [28,1.7,0.4,4500],
            [32,2.1,0.5,2700],
            [33,1.9,0.5,900],
            [34,1.6,0.3,22000],
            [35,2.2,0.4,3600],
            [36,1.2,0.1,900],
            [37,1.5,0.3,900],
            [38,1.7,0.4,300],
            [39,1.5,0.3,900],
            [40,1.7,0.2,900],
            [41,0.9,0.2,900],
            [42,1.2,0.3,1800],
            [43,2.0,0.5,1900],
            [44,1.0,0.2,2700],
            [45,1,7,0.3,900],
            [46,0.9,0.3,900],
            [47,1.1,0.1,900],
            [48,1.0,0.2,1800],
            [52,1.6,0.4,600],
            [53,1.6,0.4,22000],
            [57,1.7,0.3,600],
            [58,1.6,0.5,22000],
            [59,0.7,0.2,1800],
        ];
        for (const purchasedItem of purchasedItemNumbers) {
            await this.purchasedItemRepository.save(
                new PurchasedItem({
                    number: purchasedItem[0],
                    ordertype: 0,
                    costs: 0,
                    warehouseStock: 0,
                    calculatedPurchase: 0,
                    deliverytime: purchasedItem[1],
                    deviation: purchasedItem[2],
                    discountQuantity: purchasedItem[3],
                    descriptionProductionOrder: "",
                    descriptionWaitingList: "",
                    itemPurchasedItems: [],
                }),
            );
        }
    }
    public async fillItemPurchasedItem() {
        const purchasedItemMapping = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [7, 7, 7],
            [4, 4, 4],
            [2, 2, 2],
            [4, 5, 6],
            [3, 3, 3],
            [0, 0, 2],
            [0, 0, 72],
            [4, 4, 4],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [2, 2, 2],
            [1, 1, 1],
            [1, 1, 1],
            [2, 2, 2],
            [1, 1, 1],
            [3, 3, 3],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [2, 2, 2],
            [2, 0, 0],
            [72, 0, 0],
            [0, 2, 0],
            [0, 72, 0],
            [2, 2, 2],
        ];
        const ps = [
            await this.itemRepository.findOneBy({ itemNumber: 1 }),
            await this.itemRepository.findOneBy({ itemNumber: 2 }),
            await this.itemRepository.findOneBy({ itemNumber: 3 }),
        ];
        const purchasedItem = await this.purchasedItemRepository.find();
        for (let i = 0; i < purchasedItem.length; i++) {
            for (let j = 0; j < 3; j++) {
                if (purchasedItemMapping[i][j] !== 0) {
                    await this.itemPurchasedItemRepository.save(
                        new ItemPurchasedItem({
                            item: ps[j],
                            purchasedItem: purchasedItem[i],
                            multiplier: purchasedItemMapping[i][j],
                        }),
                    );
                }
            }
        }
    }

    public async resetWaitingList() {
        let waitingLists = await this.waitingListRepository.find();
        waitingLists.forEach(async (it) => {
            await this.waitingListRepository.remove(it);
        });
    }

    public async resetPurchasedItem() {
        let purchasedItems = await this.purchasedItemRepository.find();
        purchasedItems.forEach(async (it) => {
            it.ordertype = 0;
            it.costs = 0;
            it.warehouseStock = 0;
            it.calculatedPurchase = 0;
            await this.entityManager.save(it);
        });
    }
}
