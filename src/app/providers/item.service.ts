import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
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
        for (let it of itemDtoList) {
            let item = new Item(it);
            await this.entityManager.save(item);
            break;
        }
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
            itemDto.warehouseStock = itemDto.warehouseStock + item.warehouseStock;
            itemDto.safetyStock = itemDto.safetyStock + item.safetyStock;
            itemDto.waitingQueue = itemDto.waitingQueue + item.waitingQueue;
            itemDto.workInProgress = itemDto.workInProgress + item.workInProgress;
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

        for (let product of products) {
            let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(product.itemNumber);

            let workInProgress = await this.waitingListService.getWorkInProgressByItemId(product.itemNumber);

            if (waitingListAmount !== null) {
                product.waitingQueue = waitingListAmount;
            }

            if (workInProgress !== null) {
                product.workInProgress = workInProgress;
            }

            product.productionOrder =
                product.productionOrder +
                product.safetyStock -
                waitingListAmount -
                workInProgress -
                product.warehouseStock;

            await this.entityManager.save(product);
        }

        for (let product of products) {
            await this.resolveChildren(product, product.productionOrder, product.waitingQueue);
        }
    }

    private async resolveChildren(item: Item, parentProdctionOrder: number, parentWaitingList: number) {
        if (item.itemNumber === 1 || item.itemNumber === 2 || item.itemNumber === 3) {
            let childreen = item.consistsOf;
            for (var i in childreen) {
                if (i === null || i === undefined) {
                    return;
                }
                let child = await this.itemRepository.find({
                    relations: { consistsOf: true },
                    where: { itemNumber: childreen[i].itemNumber },
                });

                if (child === null || child === undefined) {
                    return;
                }
                await this.resolveChildren(child[0], item.productionOrder, item.waitingQueue);
            }
        } else if (item.itemNumber === 16 || item.itemNumber === 17) {
            if (item.productionOrder === 0) {
                let waitingListP51 = await this.waitingListService.getWaitingListAmountByItemId(51);
                let waitingListP56 = await this.waitingListService.getWaitingListAmountByItemId(56);
                let waitingListP31 = await this.waitingListService.getWaitingListAmountByItemId(31);

                let itemP51 = await this.itemRepository.find({
                    where: {
                        itemNumber: 51,
                    },
                });

                let itemP56 = await this.itemRepository.find({
                    where: {
                        itemNumber: 56,
                    },
                });

                let itemP31 = await this.itemRepository.find({
                    where: {
                        itemNumber: 31,
                    },
                });

                let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(item.itemNumber);

                let workInProgress = await this.waitingListService.getWorkInProgressByItemId(item.itemNumber);

                item.productionOrder =
                    item.productionOrder +
                    itemP51[0].productionOrder +
                    itemP56[0].productionOrder +
                    itemP31[0].productionOrder +
                    item.safetyStock -
                    waitingListP51 +
                    waitingListP56 +
                    waitingListP31 +
                    workInProgress -
                    waitingListAmount -
                    item.warehouseStock;

                let childreen = item.consistsOf;
                for (var i in childreen) {
                    if (i === null || i === undefined) {
                        return;
                    }
                    let child = await this.itemRepository.find({
                        relations: { consistsOf: true },
                        where: { itemNumber: childreen[i].itemNumber },
                    });

                    if (child === null || child === undefined) {
                        return;
                    }
                    await this.resolveChildren(child[0], item.productionOrder, item.waitingQueue);
                }
            }
        } else if (item.itemNumber === 26) {
            if (item.productionOrder === 0) {
                let waitingListP1 = await this.waitingListService.getWaitingListAmountByItemId(1);
                let waitingListP2 = await this.waitingListService.getWaitingListAmountByItemId(2);
                let waitingListP3 = await this.waitingListService.getWaitingListAmountByItemId(3);

                let itemP1 = await this.itemRepository.find({
                    where: {
                        itemNumber: 1,
                    },
                });

                let itemP2 = await this.itemRepository.find({
                    where: {
                        itemNumber: 2,
                    },
                });

                let itemP3 = await this.itemRepository.find({
                    where: {
                        itemNumber: 3,
                    },
                });

                let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(item.itemNumber);

                let workInProgress = await this.waitingListService.getWorkInProgressByItemId(item.itemNumber);

                item.productionOrder =
                    item.productionOrder +
                    itemP1[0].productionOrder +
                    itemP2[0].productionOrder +
                    itemP3[0].productionOrder +
                    item.safetyStock -
                    waitingListP1 +
                    waitingListP2 +
                    waitingListP3 +
                    workInProgress -
                    waitingListAmount -
                    item.warehouseStock;
            }
            let childreen = item.consistsOf;
            for (var i in childreen) {
                if (i === null || i === undefined) {
                    return;
                }
                let child = await this.itemRepository.find({
                    relations: { consistsOf: true },
                    where: { itemNumber: childreen[i].itemNumber },
                });

                if (child === null || child === undefined) {
                    return;
                }
                await this.resolveChildren(child[0], item.productionOrder, item.waitingQueue);
            }
        } else {
            //TODO checken, ob workInProgress und waitingList richtig verrechnet werden
            let waitingListAmount = await this.waitingListService.getWaitingListAmountByItemId(item.itemNumber);

            let workInProgress = await this.waitingListService.getWorkInProgressByItemId(item.itemNumber);

            if (item.productionOrder === 0) {
                item.productionOrder = parentProdctionOrder;
            }
            console.log('item.productionOrder = ' + item.productionOrder);
            item.productionOrder =
                item.productionOrder +
                parentWaitingList +
                item.safetyStock -
                waitingListAmount -
                workInProgress -
                item.warehouseStock;
            console.log(
                `itemId: ${item.itemNumber} Rechnung: ${item.productionOrder} = ${parentWaitingList} + ${item.safetyStock} - ${waitingListAmount} - ${workInProgress} - ${item.warehouseStock}`,
            );

            if (waitingListAmount !== null) {
                item.waitingQueue = waitingListAmount;
            }

            if (workInProgress !== null) {
                item.workInProgress = workInProgress;
            }

            if (item.productionOrder < 0) {
                item.productionOrder = 0;
            }

            await this.entityManager.save(item);

            let childreen = item.consistsOf;

            for (var i in childreen) {
                if (i === null || i === undefined) {
                    return;
                }
                let child = await this.itemRepository.find({
                    relations: { consistsOf: true },
                    where: { itemNumber: childreen[i].itemNumber },
                });
                if (child === null || child === undefined) {
                    return;
                }
                await this.resolveChildren(child[0], item.productionOrder, item.waitingQueue);
            }
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
