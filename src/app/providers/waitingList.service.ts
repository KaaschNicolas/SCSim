import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';
import { Repository, EntityManager } from 'typeorm';
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
                    let waitingListAmount26 = it.amount / 3;
                    let timeNeedAmount26 = it.timeNeed / 3;
                    let waitingListDto261: WaitingListDto = {
                        itemId: 261,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount26,
                        timeNeed: timeNeedAmount26,
                        isInWork: it.isInWork,
                    };
                    let waitingList261 = new WaitingList(waitingListDto261);
                    await this.entityManager.save(waitingList261);

                    let waitingListDto262: WaitingListDto = {
                        itemId: 262,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount26,
                        timeNeed: timeNeedAmount26,
                        isInWork: it.isInWork,
                    };
                    let waitingList262 = new WaitingList(waitingListDto262);
                    await this.entityManager.save(waitingList262);
                    
                    let waitingListDto263: WaitingListDto = {
                        itemId: 263,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount26,
                        timeNeed: timeNeedAmount26,
                        isInWork: it.isInWork,
                    };
                    let waitingList263 = new WaitingList(waitingListDto263);
                    await this.entityManager.save(waitingList263);
                    
                    break;
                case 16:
                    let waitingListAmount16 = it.amount / 3;
                    let timeNeedAmount16 = it.timeNeed / 3;
                    let waitingListDto161: WaitingListDto = {
                        itemId: 161,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount16,
                        timeNeed: timeNeedAmount16,
                        isInWork: it.isInWork,
                    };
                    let waitingList161 = new WaitingList(waitingListDto161);
                    await this.entityManager.save(waitingList161);

                    let waitingListDto162: WaitingListDto = {
                        itemId: 162,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount16,
                        timeNeed: timeNeedAmount16,
                        isInWork: it.isInWork,
                    };
                    let waitingList162 = new WaitingList(waitingListDto162);
                    await this.entityManager.save(waitingList162);

                    let waitingListDto163: WaitingListDto = {
                        itemId: 163,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount16,
                        timeNeed: timeNeedAmount16,
                        isInWork: it.isInWork,
                    };
                    let waitingList163 = new WaitingList(waitingListDto163);
                    await this.entityManager.save(waitingList163);
                    break;
                case 17:
                    let waitingListAmount17 = it.amount / 3;
                    let timeNeedAmount17 = it.timeNeed / 3;
                    let waitingListDto171: WaitingListDto = {
                        itemId: 171,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount17,
                        timeNeed: timeNeedAmount17,
                        isInWork: it.isInWork,
                    };
                    let waitingList171 = new WaitingList(waitingListDto171);
                    await this.entityManager.save(waitingList171);

                    let waitingListDto172: WaitingListDto = {
                        itemId: 172,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount17,
                        timeNeed: timeNeedAmount17,
                        isInWork: it.isInWork,
                    };
                    let waitingList172 = new WaitingList(waitingListDto172);
                    await this.entityManager.save(waitingList172);

                    let waitingListDto173: WaitingListDto = {
                        itemId: 173,
                        workingStationId: it.workingStationId,
                        amount: waitingListAmount17,
                        timeNeed: timeNeedAmount17,
                        isInWork: it.isInWork,
                    };
                    let waitingList173 = new WaitingList(waitingListDto173);
                    await this.entityManager.save(waitingList173);
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
        let waitingList = await this.waitingListRepository.find({
            where: { itemId: itemId, isInWork: false },
        });
        if (waitingList.length !== 0) {
            return waitingList[0].amount;
        }
        return 0;
    }

    public async getWorkInProgressByItemId(itemId: number) {
        let waitingList = await this.waitingListRepository.find({
            where: { itemId: itemId, isInWork: true },
        });
        if (waitingList.length !== 0) {
            return waitingList[0].amount;
        }
        return 0;
    }
}
