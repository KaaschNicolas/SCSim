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
import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { PurchasedItemService } from './purchasedItem.service';
import { PurchasedItemDto } from '../dto/purchasedItem.dto';
import { FutureOrderDto } from '../dto/futureOrder.dto';
import { Order } from 'src/entity/order.entity';

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

    public async insert(futureOrderDto: FutureOrderDto[]) {
        await this.orderRepository.clear();
        this.logger.log('Inserting Orders');
        for (let futureOrder of futureOrderDto) {
            let purchasedItem = await this.purchasedItemRepository.findOne({
                where: {
                    number: futureOrder.purchasedItemId,
                },
            });
            let period = 1; //TODO Echte CurPeriod auslesen!!
            let periodDifference = period + 1 - futureOrder.orderPeriod;
            let maxDeliveryTime = purchasedItem.deliverytime * 5 + purchasedItem.deviation * 5;
            let daysAfterToday = 0;
            console.log(periodDifference + ' ' + periodDifference + ' ' + maxDeliveryTime);
            if (futureOrder.mode === 4) {
                daysAfterToday = maxDeliveryTime / 2 - 5 * periodDifference;
            } else if (futureOrder.mode === 5) {
                daysAfterToday = maxDeliveryTime - 5 * periodDifference;
            }
            await this.orderRepository.save(
                new Order({
                    purchasedItem: purchasedItem,
                    mode: futureOrder.mode,
                    amount: futureOrder.amount,
                    daysAfterToday: Math.ceil(daysAfterToday),
                }),
            );
        }
    }
    public async clear() {
        await this.orderRepository.clear();
    }
    public async getOrders() {
        return null;
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

    public async updateStockHistoryByOrders(purchasedItemDto: PurchasedItemDto) {
        let orders = await this.orderRepository.find({
            relations: {
                purchasedItem: true,
            },
        });

        for (let order of orders) {
            if (order.purchasedItem.number == purchasedItemDto.number) {
                if (order.daysAfterToday < 0) {
                    order.daysAfterToday = 0;
                }
                for (let i = 0; i < 28; i++) {
                    purchasedItemDto.stockHistory.set(i, purchasedItemDto.stockHistory[i] + order.amount);
                }
            }
        }
    }
}
