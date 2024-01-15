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
        let resetPurchasedItems = await this.purchasedItemRepository.find();
        resetPurchasedItems.forEach(async (it) => {
            it.calculatedPurchase = 0;
            it.descriptionProductionOrder = "";
            it.descriptionWaitingList = "";
            await this.entityManager.save(it);
        });

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
            if (it.calculatedPurchase <= 0) {
                return;
            }
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

        purchasedItem.descriptionProductionOrder = "Berechnung: Es gibt insgesamt " + item.productionOrder + " Produktionaufträge für P" + item.itemNumber + ". Benötigte Stückzahl des Kaufteils für pro P" + item.itemNumber + ": " + itemPurchasedItem.multiplier + ". Abzüglich des Lagerbestands ergibt sich folgende Rechnung:" + "\n" + item.productionOrder + " * " + itemPurchasedItem.multiplier + " - " + purchasedItem.warehouseStock + " = " + purchasedItem.calculatedPurchase;

        let waitingLists = await this.waitingListService.getByItemId(itemPurchasedItem.item.itemNumber);


        waitingLists.forEach(async (list) => {
            console.log(list);
            purchasedItem.calculatedPurchase += itemPurchasedItem.multiplier * list.amount;
            purchasedItem.descriptionWaitingList = "Benötigte Menge für die Bearbeitung der Warteschlange von " + list.amount + " P" + list.itemId + "Produkten:\n" + itemPurchasedItem.multiplier + " * " + list.amount + " = " + (itemPurchasedItem.multiplier * list.amount); 
        });
        

        await this.entityManager.save(purchasedItem);

        this.logger.log(purchasedItem.number);
        this.logger.log(purchasedItem.calculatedPurchase);
    }

    private purchasedItemToOrderDto(purchasedItem: PurchasedItem): OrderDto {
        return {
            article: purchasedItem.number,
            quantity: purchasedItem.calculatedPurchase,
            modus: '5',
            descriptionProductionOrder: purchasedItem.descriptionProductionOrder,
            descriptionWaitingList: purchasedItem.descriptionWaitingList,
        };
    }
}
