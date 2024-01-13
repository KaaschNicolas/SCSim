import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';
import { Repository, EntityManager } from 'typeorm';
import { WaitingListContainerDto } from '../dto/waitingListContainer.dto';
import { WaitingListDto } from '../dto/waitingList.dto';

@Injectable()
export class WaitingListService {
    private readonly logger;

    constructor(
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(WaitingListService.name);
    }

    public async createWaitingList(waitingListDto: WaitingListDto[]) {
        waitingListDto.forEach(async (it) => {
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

    public async getByItemId(itemId: number) {
        return await this.waitingListRepository.find({
            where: {
                itemId: itemId,
            },
        });
    }

    public async getWaitingListAmountByItemId(itemId: number) {
        return await this.waitingListRepository.sum('amount', { itemId: itemId, isInWork: false });
    }

    public async getWorkInProgressByItemId(itemId: number) {
        return await this.waitingListRepository.sum('amount', { itemId: itemId, isInWork: true });
    }
}
