import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        private readonly entityManager: EntityManager,
    ) {}

    public async populate(): Promise<void> {
        if ((await this.workingStationRepository.count()) === 0) {
            const workingStations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

            const savePromises = workingStations.map((workingStationNumber) => {
                const workingStation = new WorkingStation({ number: workingStationNumber });
                return this.workingStationRepository.save(workingStation);
            });

            await Promise.all(savePromises);
        }
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
            ];
            console.log('Array created');
            for (const finalProduct of productionProcesses) {
                console.log('loop1');
                for (const productionStep of finalProduct) {
                    console.log('loop2');
                    let length = productionStep.length;
                    let processBefore: ProductionProcess = null;
                    /*for (let i = 0; i < length; i++) {
                        console.log('loop3: i=' + i);
                        if (i === 0) {
                            console.log('trigger if ===0');
                            //const workingStation = await this.workingStationRepository.findOne({
                              //  where: { number: productionStep[i][1] },
                            //});
                            const firstProcess = new ProductionProcess({
                                itemId: productionStep[i][0],
                                workingStation: await this.workingStationRepository.findOne({
                                    where: { number: productionStep[i][1] },
                                }),
                                workingStationId: productionStep[i][1],
                                setupTime: productionStep[i][2],
                                processingTime: productionStep[i][3],
                            });
                            console.log(firstProcess);
                            const savedProcess = await this.entityManager.save(firstProcess);
                            processBefore = firstProcess;
                            console.log(savedProcess);
                        } else {
                            const iProcess = new ProductionProcess({
                                itemId: productionStep[i][0],
                                workingStationId: productionStep[i][1],
                                workingStation: await this.workingStationRepository.findOne({
                                    where: { number: productionStep[i][1] },
                                }),
                                setupTime: productionStep[i][2],
                                processingTime: productionStep[i][3],
                                children: [new ProductionProcess(processBefore)],
                            });
                            console.log('else');
                            console.log(iProcess);
                            const savedProcess = await this.productionProcessRepository.manager.save(iProcess);
                            processBefore = savedProcess;
                            //processBefore = savedProcess;
                        }
                    }*/
                    for (let i = length - 1; i > -1; i--) {
                        console.log('loop3: i=' + i);
                        if (i === length - 1) {
                            console.log('trigger if ===0');
                            /*const workingStation = await this.workingStationRepository.findOne({
                                where: { number: productionStep[i][1] },
                            });*/
                            const firstProcess = new ProductionProcess({
                                itemId: productionStep[i][0],
                                workingStation: await this.workingStationRepository.findOne({
                                    where: { number: productionStep[i][1] },
                                }),
                                workingStationId: productionStep[i][1],
                                setupTime: productionStep[i][2],
                                processingTime: productionStep[i][3],
                            });
                            console.log(firstProcess);
                            const savedProcess = await this.entityManager.save(firstProcess);
                            processBefore = firstProcess;
                            console.log(savedProcess);
                        } else {
                            const iProcess = new ProductionProcess({
                                itemId: productionStep[i][0],
                                workingStationId: productionStep[i][1],
                                workingStation: await this.workingStationRepository.findOne({
                                    where: { number: productionStep[i][1] },
                                }),
                                setupTime: productionStep[i][2],
                                processingTime: productionStep[i][3],
                                parent: new ProductionProcess(processBefore),
                            });
                            console.log('else');
                            console.log(iProcess);
                            const savedProcess = await this.productionProcessRepository.manager.save(iProcess);
                            processBefore = savedProcess;
                            //processBefore = savedProcess;
                        }
                    }
                }
            }
        }
        /*console.log(
            await this.productionProcessRepository.manager.getTreeRepository(ProductionProcess).findDescendants(
                await this.productionProcessRepository.findOne({
                    where: { productionProcessId: 54 },
                }),
            ),
        );*/
        console.log(await this.entityManager.getTreeRepository(ProductionProcess).findTrees());
    }
}
