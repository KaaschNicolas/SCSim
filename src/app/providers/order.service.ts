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
        let purchasedItems = await this.itemPurchasedItemRepository.find();

        purchasedItems.forEach((it) => {
            this.calculateAmount(it);
        });

        let finalPurchasedItems = await this.purchasedItemRepository.find();

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
            purchasedItem.calculatedPurchase = itemPurchasedItem.multiplier * list.amount;
        });

        this.entityManager.save(purchasedItem);
    }

    private purchasedItemToOrderDto(purchasedItem: PurchasedItem): OrderDto {
        return {
            article: purchasedItem.number,
            quantity: purchasedItem.calculatedPurchase,
            //TODO hier noch Auflösung in Modi
            modus: '4',
        };
    }
}
