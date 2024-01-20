import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { Item } from 'src/entity/item.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { WaitingListService } from './waitingList.service';
import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { FutureOrderDto } from '../dto/futureOrder.dto';
import { Order } from 'src/entity/order.entity';
import { PurchasedItemDto } from '../dto/purchasedItem.dto';
import { PurchasedItemService } from './purchasedItem.service';

@Injectable()
export class OrderService {
    private readonly logger;

    constructor(
        @Inject(WaitingListService)
        private readonly waitingListService: WaitingListService,
        @Inject(PurchasedItemService)
        private readonly purchasedItemService: PurchasedItemService,
        @InjectRepository(ItemPurchasedItem)
        private readonly itemPurchasedItemRepository: Repository<ItemPurchasedItem>,
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemRepository: Repository<PurchasedItem>,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(WaitingList)
        private readonly waitingListRepository: Repository<WaitingList>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(OrderService.name);
    }
    //inserts orders and calculates daysaftertoday
    public async insert(futureOrderDto: FutureOrderDto[]) {
        await this.orderRepository.clear();
        this.logger.log('Inserting Orders');
        for (let futureOrder of futureOrderDto) {
            let purchasedItem = await this.purchasedItemRepository.findOne({
                where: {
                    number: futureOrder.purchasedItemId,
                },
            })
            let period = 1;//TODO Echte CurPeriod auslesen!!
            let periodDifference = period + 1 - futureOrder.orderPeriod;
            let maxDeliveryTime = purchasedItem.deliverytime * 5 + purchasedItem.deviation * 5;
            let daysAfterToday = 0;
            console.log(periodDifference+ " "+periodDifference+ " "+maxDeliveryTime);
            if (futureOrder.mode === 4){
                daysAfterToday = maxDeliveryTime / 2 - 5 * periodDifference;
            } else if(futureOrder.mode === 5){
                daysAfterToday = maxDeliveryTime - 5 * periodDifference;
            }
            await this.orderRepository.save(new Order(
                {
                    purchasedItem: purchasedItem,
                    mode: futureOrder.mode,
                    amount: futureOrder.amount,
                    daysAfterToday: Math.ceil(daysAfterToday),
                }
            ));
        }
    }
    public async clear() {
        await this.orderRepository.clear();
    }
    public async getOrders() {
        return null;
    }/*
        let resetPurchasedItems = await this.purchasedItemRepository.find();
        resetPurchasedItems.forEach(async (it) => {
            it.calculatedPurchase = 0;
            it.descriptionProductionOrder = '';
            it.descriptionWaitingList = '';
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

        purchasedItem.calculatedPurchase +=
            itemPurchasedItem.multiplier * item.productionOrder - purchasedItem.warehouseStock;

        purchasedItem.descriptionProductionOrder +=
            'P' +
            item.itemNumber +
            ': ' +
            item.productionOrder +
            ' * ' +
            itemPurchasedItem.multiplier +
            ' - ' +
            purchasedItem.warehouseStock +
            ' = ' +
            (item.productionOrder * itemPurchasedItem.multiplier - purchasedItem.warehouseStock) +
            '\n'; //"Berechnung: Es gibt insgesamt " + item.productionOrder + " Produktionaufträge für P" + item.itemNumber + ". Benötigte Stückzahl des Kaufteils für pro P" + item.itemNumber + ": " + itemPurchasedItem.multiplier + ". Abzüglich des Lagerbestands ergibt sich folgende Rechnung:" + "\n" + item.productionOrder + " * " + itemPurchasedItem.multiplier + " - " + purchasedItem.warehouseStock + " = " + purchasedItem.calculatedPurchase;

        let waitingLists = await this.waitingListService.getByItemId(itemPurchasedItem.item.itemNumber);

        waitingLists.forEach(async (list) => {
            console.log(list);
            purchasedItem.calculatedPurchase += itemPurchasedItem.multiplier * list.amount;
            purchasedItem.descriptionWaitingList +=
                'P' +
                list.itemId +
                ': ' +
                itemPurchasedItem.multiplier +
                ' * ' +
                list.amount +
                ' = ' +
                itemPurchasedItem.multiplier * list.amount +
                '\n'; //"Benötigte Menge für die Bearbeitung der Warteschlange von " + list.amount + " P" + list.itemId + "Produkten:\n" + itemPurchasedItem.multiplier + " * " + list.amount + " = " + (itemPurchasedItem.multiplier * list.amount);
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
    }*/
    public async updateStockHistoryByForecast(purchasedItemDto: PurchasedItemDto) {
        let needForWeek = await this.purchasedItemService.calcNeedsForWeek(purchasedItemDto);

        for (let i = 0; i < needForWeek.length; i++) {
            let amount = 0;
            if (needForWeek[i] != 0) {
                amount = needForWeek[i] / 5;
            }
            for (let j = 0; j < 5; j++) {
                for (let k = i * 5 + j; k < 28; k++) {
                    purchasedItemDto.stockHistory[k] - amount;
                }
            }
        }
    }

    public async updateStockHistoryByOrders(purchasedItemDto: PurchasedItemDto) {}
}