import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    }
}
