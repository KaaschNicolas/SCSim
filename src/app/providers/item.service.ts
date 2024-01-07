import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ItemContainerDto } from '../dto/itemContainer.dto';
import { WaitingListService } from './waitingList.service';

@Injectable()
export class ItemService {
    private readonly logger;

    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly entityManager: EntityManager,
        private readonly waitingListService: WaitingListService,
    ) {
        this.logger = new Logger(ItemService.name);
    }

    public async upsertItems(itemContainerDto: ItemContainerDto) {
        this.logger.log('Upserting Items');
        itemContainerDto.itemList.forEach(async (it) => {
            switch (it.itemNumber) {
                case 26:
                    await this.itemRepository.save({
                        itemNumber: 261,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 262,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 263,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    break;
                case 16:
                    await this.itemRepository.save({
                        itemNumber: 161,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 162,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 163,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    break;
                case 17:
                    await this.itemRepository.save({
                        itemNumber: 171,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 172,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    await this.itemRepository.save({
                        itemNumber: 173,
                        safetyStock: it.safetyStock / 3,
                        warehouseStock: it.warehouseStock / 3,
                    });
                    break;
                default:
                    let item = new Item(it);
                    await this.entityManager.save(item);
                    break;
            }
        });
    }

    public async findById(itemNumber: number) {
        return await this.itemRepository.findOneBy({ itemNumber: itemNumber });
    }

    public async findAll() {
        await this.resolveBom();
        return await this.itemRepository.find();
    }

    private async resolveBom() {
        let products = await this.itemRepository.find({
            where: [{ itemNumber: 1 }, { itemNumber: 2 }, { itemNumber: 3 }],
        });

        //productionOrder for p1, p2, p3 must be prefilled (forecast)
        products.forEach(async (item) => {
            await this.resolveChildren(item, item.productionOrder);
        });
    }

    private async resolveChildren(item: Item, parentProdctionOrder: number) {
        let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(item.itemNumber);

        let workInProgress = await this.waitingListService.getWorkInProgressByItemId(item.itemNumber);

        item.productionOrder = parentProdctionOrder;
        item.productionOrder += item.safetyStock - item.warehouseStock - waitingListAmount - workInProgress;

        item.waitingQueue = waitingListAmount;
        item.workInProgress = workInProgress;

        await this.entityManager.save(item);

        let childreen = item.consistsOf;

        childreen.forEach(async (child) => {
            if (child === null) {
                return;
            }

            await this.resolveChildren(child, item.productionOrder);
        });
    }
}
