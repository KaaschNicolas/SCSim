import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';
import { Repository, EntityManager } from 'typeorm';
import { WaitingListContainerDto } from '../dto/waitingListContainer.dto';

@Injectable()
export class WaitingListService {
    constructor(
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        private readonly entityManager: EntityManager,
    ) {}

    public async createWaitingList(waitingListDto: WaitingListContainerDto) {
        waitingListDto.waitingLists.forEach(async (it) => {
            let waitingList = new WaitingList(it);
            await this.entityManager.save(waitingList);
        });
    }

    public async getByWorkplace(workplaceId: number) {
        return await this.waitingListRepository.find({
            where: {
                workingStationId: workplaceId,
            },
        });
    }
}