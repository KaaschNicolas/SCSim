import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ItemContainerDto } from '../dto/itemContainer.dto';
import { WaitingListService } from './waitingList.service';
import { ItemDto } from '../dto/item.dto';

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

    public async upsertItems(itemDtoList: ItemDto[]) {
        this.logger.log('Upserting Items');
        itemDtoList.forEach(async (it) => {
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

    public async getAll() {
        let items = await this.itemRepository.find();
        let itemDtoList = new Array<ItemDto>();
        items.forEach((item) => {
            switch (item.itemNumber) {
                case 261:
                    this.convertMultipleToSingle(item, itemDtoList, 26);
                    break;
                case 262:
                    this.convertMultipleToSingle(item, itemDtoList, 26);
                    break;
                case 263:
                    this.convertMultipleToSingle(item, itemDtoList, 26);
                    break;
                case 161:
                    this.convertMultipleToSingle(item, itemDtoList, 16);
                    break;
                case 162:
                    this.convertMultipleToSingle(item, itemDtoList, 16);
                    break;
                case 163:
                    this.convertMultipleToSingle(item, itemDtoList, 16);
                    break;
                case 171:
                    this.convertMultipleToSingle(item, itemDtoList, 17);
                    break;
                case 172:
                    this.convertMultipleToSingle(item, itemDtoList, 17);
                    break;
                case 173:
                    this.convertMultipleToSingle(item, itemDtoList, 17);
                    break;
                default:
                    itemDtoList?.push(
                        new ItemDto(
                            item.itemNumber,
                            item.safetyStock,
                            item.warehouseStock,
                            item.productionOrder,
                            item.waitingQueue,
                            item.workInProgress,
                        ),
                    );
                    break;
            }
        });
        return itemDtoList;
    }

    private convertMultipleToSingle(item: Item, itemDtoList: ItemDto[], itemNumber: number) {
        let itemDto = itemDtoList.find((it) => it.itemNumber === itemNumber);
        if (itemDto !== null && itemDto !== undefined) {
            itemDto.productionOrder = itemDto.productionOrder + item.productionOrder;
        } else {
            itemDtoList.push(
                new ItemDto(
                    itemNumber,
                    item.safetyStock,
                    item.warehouseStock,
                    item.productionOrder,
                    item.waitingQueue,
                    item.workInProgress,
                ),
            );
        }
    }

    public async findById(itemNumber: number) {
        return await this.itemRepository.findOneBy({ itemNumber: itemNumber });
    }

    public async triggerCalculateBom() {
        this.logger.log('findAll');
        await this.resolveBom();
        return await this.getAll();
    }

    private async resolveBom() {
        this.logger.log('resolveBom');
        let products = await this.itemRepository.find({
            where: [{ itemNumber: 1 }, { itemNumber: 2 }, { itemNumber: 3 }],
            relations: { consistsOf: true },
        });

        //productionOrder for p1, p2, p3 must be prefilled (forecast)
        products.forEach(async (item) => {
            await this.resolveChildren(item, item.productionOrder);
        });
    }

    private async resolveChildren(item: Item, parentProdctionOrder: number) {
        console.log('resolveChildren');
        let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(item.itemNumber);

        let workInProgress = await this.waitingListService.getWorkInProgressByItemId(item.itemNumber);
        //console.log(waitingListAmount);
        //console.log(workInProgress);

        item.productionOrder = parentProdctionOrder;
        item.productionOrder += item.safetyStock - item.warehouseStock - waitingListAmount - workInProgress;

        console.log(`calculated productionOrder  ${item.productionOrder}`);

        if (waitingListAmount !== null || workInProgress !== null) {
            item.waitingQueue = waitingListAmount;
            item.workInProgress = workInProgress;
        }

        await this.entityManager.save(item);

        console.log(item.consistsOf);
        let childreen = item.consistsOf;

        for (var i in childreen) {
            if (i === null || i === undefined) {
                return;
            }
            let child = await this.itemRepository.find({
                relations: { consistsOf: true },
                where: { itemNumber: childreen[i].itemNumber },
            });
            console.log(`child: ${child}`);
            if (child === null || child === undefined) {
                return;
            }
            await this.resolveChildren(child[0], item.productionOrder);
        }

        /*
        childreen.forEach(async (child) => {
            if (child === null || child === undefined) {
                return;
            }

            await this.resolveChildren(child, item.productionOrder);
        });
        */
    }
}
