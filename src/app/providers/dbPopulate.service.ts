import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
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
        if ((await this.workingStationRepository.count()) === 0) {
            const workingStations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

            const savePromises = workingStations.map((workingStationNumber) => {
                const workingStation = new WorkingStation({ number: workingStationNumber });
                return this.workingStationRepository.save(workingStation);
            });

            await Promise.all(savePromises);
        } else {
            console.log('WorkingStations are already written in DB');
        }
        console.log('WorkingStationPopulateEnded');
        console.log('ItemPopulateStarts');
        if ((await this.itemRepository.count()) === 0) {
            const itemNumbers = [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                55, 56, 57, 58, 59,
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
                await this.updateItemConsistsOf(1, [26, 51]);
                await this.updateItemConsistsOf(51, [16, 17, 50]);
                await this.updateItemConsistsOf(50, [4, 10, 49]);
                await this.updateItemConsistsOf(49, [7, 13, 18]);
                await this.updateItemConsistsOf(2, [26, 56]);
                await this.updateItemConsistsOf(56, [16, 17, 55]);
                await this.updateItemConsistsOf(55, [5, 11, 54]);
                await this.updateItemConsistsOf(54, [8, 14, 19]);
            } catch (error) {
                console.error('An error occurred:', error);
            }
            /* //P1
            const item26 = await this.itemRepository.findOne({ where: { itemNumber: Number(26) } });
            const item51 = await this.itemRepository.findOne({ where: { itemNumber: Number(51) } });
            const item1 = await this.itemRepository.findOne({ where: { itemNumber: Number(1) } });
            
            console.log(item51);
            item1.consistsOf = [item26, item51];
            await this.itemRepository.save(item1);
            const item16 = await this.itemRepository.findOne({ where: { itemNumber: Number(16) } });
            const item17 = await this.itemRepository.findOne({ where: { itemNumber: Number(17) } });
            const item50 = await this.itemRepository.findOne({ where: { itemNumber: Number(50) } });
            item51.consistsOf = [item16, item17, item50];
            await this.itemRepository.save(item51);
            const item4 = await this.itemRepository.findOne({ where: { itemNumber: Number(4) } });
            const item10 = await this.itemRepository.findOne({ where: { itemNumber: Number(10) } });
            const item49 = await this.itemRepository.findOne({ where: { itemNumber: Number(49) } });
            item50.consistsOf = [item4, item10, item49];
            await this.itemRepository.save(item50);
            const item7 = await this.itemRepository.findOne({ where: { itemNumber: Number(7) } });
            const item13 = await this.itemRepository.findOne({ where: { itemNumber: Number(13) } });
            const item18 = await this.itemRepository.findOne({ where: { itemNumber: Number(18) } });
            item49.consistsOf = [item7, item13, item18];
            await this.itemRepository.save(item49);
            //P2
            //const item26 = await this.itemRepository.findOne({ where: { itemNumber: Number(26) }});
            const item56 = await this.itemRepository.findOne({ where: { itemNumber: Number(56) } });
            const item2 = await this.itemRepository.findOne({ where: { itemNumber: Number(2) } });
            item2.consistsOf = [item26, item56];
            await this.itemRepository.save(item2);
            const item55 = await this.itemRepository.findOne({ where: { itemNumber: Number(55) } });
            item56.consistsOf = [item16, item17, item55];
            await this.itemRepository.save(item56);
            const item5 = await this.itemRepository.findOne({ where: { itemNumber: Number(5) } });
            const item11 = await this.itemRepository.findOne({ where: { itemNumber: Number(11) } });
            const item54 = await this.itemRepository.findOne({ where: { itemNumber: Number(54) } });
            item55.consistsOf = [item5, item11, item54];
            await this.itemRepository.save(item55);
            const item8 = await this.itemRepository.findOne({ where: { itemNumber: Number(8) } });
            const item14 = await this.itemRepository.findOne({ where: { itemNumber: Number(14) } });
            const item19 = await this.itemRepository.findOne({ where: { itemNumber: Number(19) } });
            item54.consistsOf = [item8, item14, item19];
            await this.itemRepository.save(item54); */

            /* const itemConsists: [number, number[]][] = [
                [1, [26, 51]],
                [51, [16, 17, 50]],
                [50, [4, 10, 49]],
                [49, [7, 13, 18]],
            ];
            for (const item of itemConsists) {
                const mainItem = await this.itemRepository.findOne({ where: { itemNumber: Number(item[0]) } });
                console.log(item[0]);
                console.log(item[1]);
                console.log('loop1');
                console.log(mainItem);
                for (let i = 0; i < item[1].length; i++) {
                    console.log('item[1].length: ' + item[1].length);
                    const updateItem = await this.itemRepository.findOne({ where: { itemNumber: Number(item[1][i]) } });
                    console.log('parentItem: ' + mainItem);
                    updateItem.parentItem = mainItem;
                    await this.itemRepository.save(updateItem);
                    console.log('loop2');
                    console.log(updateItem);
                }
            } */
        } else {
            console.log('Items are already written in DB');
        }
        console.log('ItemPopulateEnded');
        console.log('ProuctionProcessStart');
        if ((await this.productionProcessRepository.count()) === 0) {
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
                    [[17, 15, 3, 15]],
                    //E16/8
                    [
                        [16, 14, 3, 0],
                        [16, 6, 2, 15],
                    ],
                    //E50/9
                    [[50, 2, 5, 30]],
                    //E51/10
                    [[51, 3, 5, 20]],
                    //E26/11
                    [
                        [26, 15, 3, 15],
                        [26, 7, 2, 30],
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
                    //DUPLICATE
                    //E16/8
                    //DUPLICATE
                    //E55/9
                    [[55, 2, 5, 30]],
                    //E56/10
                    [[56, 3, 6, 20]],
                    //E26/11
                    //DUPLICATE
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
                    //DUPLICATE
                    //E16/8/productionStep
                    //DUPLICATE
                    //E30/9/productionStep
                    [[30, 2, 5, 20]],
                    //E31/10/productionStep
                    [[31, 3, 6, 20]],
                    //E26/11/productionStep
                    //DUPLICATE
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
        } else {
            console.log('Production processes are already written in DB');
        }
        console.log('populate ProuctionProcess Ended');
        /*         console.log(
            await this.productionProcessRepository.manager.getTreeRepository(ProductionProcess).findDescendants(
                await this.productionProcessRepository.findOne({
                    where: { productionProcessId: 100 },
                }),
            ),
        );*/
        const testItemArray = [1, 51, 50, 49, 2, 56, 55, 54];
        for (const item of testItemArray) {
            console.log(
                await this.entityManager.getTreeRepository(Item).findDescendantsTree(
                    await this.itemRepository.findOne({
                        where: { itemNumber: item },
                    }),
                ),
            );
        }
    }
}
