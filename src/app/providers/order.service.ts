import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { Item } from 'src/entity/item.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { WaitingListService } from './waitingList.service';
import { ItemService } from './item.service';
import { OrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
    private readonly logger;

    constructor(
        @Inject(WaitingListService)
        private readonly waitingListService: WaitingListService,
        @InjectRepository(ItemPurchasedItem)
        private readonly itemPurchasedItemRepository: Repository<ItemPurchasedItem>,
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemRepository: Repository<PurchasedItem>,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(OrderService.name);
    }

    public async getOrders() {
        let purchasedItems = await this.itemPurchasedItemRepository.find({
            relations: {
                purchasedItem: true,
                item: true,
            },
        });

        this.logger.log(purchasedItems.length);

        for (const purchasedItem of purchasedItems) {
            await this.calculateAmount(purchasedItem);
        }

        let finalPurchasedItems = await this.purchasedItemRepository.find();

        this.logger.log(`!!!!!!!!!!!!${finalPurchasedItems.length}`);

        let returnValue: OrderDto[] = [];

        finalPurchasedItems.forEach((it) => {
            returnValue.push(this.purchasedItemToOrderDto(it));
        });

        return returnValue;
    }

    private async calculateAmount(itemPurchasedItem: ItemPurchasedItem) {
        let purchasedItem = await this.purchasedItemRepository.findOne({
            where: {
                number: itemPurchasedItem.purchasedItem.number,
            },
            relations: {
                itemPurchasedItems: true,
            },
        });

        let item = await this.itemRepository.findOne({
            where: {
                itemNumber: itemPurchasedItem.item.itemNumber,
            },
        });

        purchasedItem.calculatedPurchase =
            itemPurchasedItem.multiplier * item.productionOrder - purchasedItem.warehouseStock;

        let waitingLists = await this.waitingListService.getByItemId(itemPurchasedItem.item.itemNumber);

        waitingLists.forEach(async (list) => {
            purchasedItem.calculatedPurchase += itemPurchasedItem.multiplier * list.amount;
        });

        await this.entityManager.save(purchasedItem);

        this.logger.log(purchasedItem.number);
        this.logger.log(purchasedItem.calculatedPurchase);
    }

    private purchasedItemToOrderDto(purchasedItem: PurchasedItem): OrderDto {
        return {
            article: purchasedItem.number,
            quantity: purchasedItem.calculatedPurchase,
            modus: '4',
        };
    }
}
