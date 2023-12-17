import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DbPopulateService {
    constructor(
        @InjectRepository(WorkingStation)
        private readonly workingStationRepository: Repository<WorkingStation>,
    ) {}

    public async populate(): Promise<void> {
        if ((await this.workingStationRepository.count()) < 0) {
            const workingStations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

            const savePromises = workingStations.map((workingStationNumber) => {
                const workingStation = new WorkingStation({ number: workingStationNumber });
                return this.workingStationRepository.save(workingStation);
            });

            await Promise.all(savePromises);
        }
        const productionProcessesP1 = [
            //P1
            //E13/1
            [
                [13, 9, 3, 15],
                [13, 7, 2, 20],
                [13, 8, 1, 15],
                [13, 12, 3, 0],
                [13, 13, 2, 0],
            ],
            //E18/2
            [
                [18, 9, 2, 15],
                [18, 7, 2, 20],
                [18, 8, 3, 20],
                [18, 6, 3, 15],
            ],
            //E7/3
            [7, 11, 3, 20],
            [7, 10, 4, 20],
            //E4/4
            [4, 11, 3, 10],
            [4, 10, 4, 20],
            //E10/5
            [10, 9, 3, 15],
            [10, 7, 2, 20],
            [10, 8, 1, 15],
            [10, 12, 3, 0],
            [10, 13, 2, 0],
            //E49/6
            [49, 1, 6, 20],
            //E17/7
            [17, 15, 3, 15],
            //E16/8
            [16, 14, 3, 0],
            [16, 6, 2, 15],
            //E50/9
            [50, 2, 5, 30],
            //E51/10
            [51, 3, 5, 20],
            //E36/11
            [26, 15, 3, 15],
            [26, 7, 2, 30],
            //P1/12
            [1, 4, 6, 30],
        ];
        new ProductionProcess({
            itemId: 13,
            workingStationId: 9,
            processingTime: 3,
            setupTime: 15,
        });
    }
}
