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
            switch (it.itemId) {
                case 26:
                    let waitingListDto26: WaitingListDto = {
                        itemId: 261,
                        workingStationId: it.workingStationId,
                        amount: it.amount,
                        timeNeed: it.timeNeed,
                        isInWork: it.isInWork,
                    };
                    let waitingList26 = new WaitingList(waitingListDto26);
                    await this.entityManager.save(waitingList26);
                    break;
                case 16:
                    let waitingListDto16: WaitingListDto = {
                        itemId: 161,
                        workingStationId: it.workingStationId,
                        amount: it.amount,
                        timeNeed: it.timeNeed,
                        isInWork: it.isInWork,
                    };
                    let waitingList16 = new WaitingList(waitingListDto16);
                    await this.entityManager.save(waitingList16);
                    break;
                case 17:
                    let waitingListDto17: WaitingListDto = {
                        itemId: 171,
                        workingStationId: it.workingStationId,
                        amount: it.amount,
                        timeNeed: it.timeNeed,
                        isInWork: it.isInWork,
                    };
                    let waitingList17 = new WaitingList(waitingListDto17);
                    await this.entityManager.save(waitingList17);
                default:
                    let waitingList = new WaitingList(it);
                    await this.entityManager.save(waitingList);
                    break;
            }
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
        return (await this.waitingListRepository.findOne({ where: { itemId: itemId, isInWork: false } })).amount;
    }

    public async getWorkInProgressByItemId(itemId: number) {
        return (await this.waitingListRepository.findOne({ where: { itemId: itemId, isInWork: true } })).amount;
    }
}
