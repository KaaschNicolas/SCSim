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
import { OrderDto } from '../dto/order.dto';
import { ItemDto } from '../dto/item.dto';

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

    public async insert(futureOrderDto: FutureOrderDto[], period: number) {
        await this.orderRepository.clear();
        this.logger.log('Inserting Orders');
        for (let futureOrder of futureOrderDto) {
            let purchasedItem = await this.purchasedItemRepository.findOne({
                where: {
                    number: futureOrder.purchasedItemId,
                },
            });
            if (period === undefined || period === null) {
                console.log("keine Period gesetzt Alarm");
            }
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
        let allOrders = await this.orderRepository.find();

        let purchasedItems = await this.purchasedItemRepository.find();

        let purchasedItemDtos: Array<PurchasedItemDto> = [];
        for (let purchasedItem of purchasedItems) {
            purchasedItemDtos.push(this.convertPurchasedItemToDto(purchasedItem));
        }

        for (let purchasedItemDto of purchasedItemDtos) {
            this.updateStockHistoryByOrders(purchasedItemDto);

            this.updateStockHistoryByForecast(purchasedItemDto);
        }

        let actualOrders = this.createOrders(purchasedItemDtos);

        return actualOrders;
    }

    private convertPurchasedItemToDto(purchasedItem: PurchasedItem): PurchasedItemDto {
        return {
            number: purchasedItem.number,
            ordertype: purchasedItem.ordertype,
            warehouseStock: purchasedItem.warehouseStock,
            costs: purchasedItem.costs,
            calculatedPurchase: purchasedItem.calculatedPurchase,
            deliverytime: purchasedItem.deliverytime,
            deviation: purchasedItem.deviation,
            discountQuantity: purchasedItem.discountQuantity,
            stockHistory: new Map<number, number>(),
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
                for (let i = order.daysAfterToday; i < 28; i++) {
                    purchasedItemDto.stockHistory.set(i, purchasedItemDto.stockHistory[i] + order.amount);
                }
            }
        }
    }

    public async createOrders(purchasedItemDtoList: PurchasedItemDto[]) {
        this.logger.log('createOrders');
        let newOrders = Array<OrderDto>();
        for (const purchasedItem of purchasedItemDtoList){
            const orders = Array<OrderDto>();
            //Ich brauche im OrderDto noch die discountquantity
            let discountQuantity = purchasedItem.discountQuantity; //!!!
            let descriptionString: string;
            this.logger.log('Berechne Bestellungen für Produkt: ${purchasedItem.number}');
            let maxDeliveryTime = purchasedItem.deliverytime + purchasedItem.deviation;
            this.logger.log('MaxDeliveryTime: ${maxDeliveryTime}');
            //Lagerbestandsverlauf?
            for (let i = 0; i < 20; i++) {
                if (
                    purchasedItem.stockHistory.get(i + 1) < 0 &&
                    purchasedItem.stockHistory.get(i + 2) < 0 &&
                    purchasedItem.stockHistory.get(i + 3) < 0 &&
                    purchasedItem.stockHistory.get(i + 4) < 0
                ) {
                    let orderDay = (purchasedItem.deliverytime + purchasedItem.deviation) * 5;
                    this.logger.log(orderDay);
                    if (orderDay < 6) {
                        this.logger.log('Produkt geht an Tag ${i} aus und wird am Tag ${orderDay} bestellt');
                        descriptionString = 'Produkt geht an Tag ${i} aus und wird am Tag ${orderDay} bestellt\n';
                    }
                    //Bestand in OrderHistory aktualisieren für aktualisierten Lagerbestandsverlauf
                    for (let j = i; j < 27; j++) {
                        let newStock = purchasedItem.stockHistory.get(j) + discountQuantity;
                        purchasedItem.stockHistory.set(j, newStock);
                        if (j == 26) {
                            this.logger.log('Neuer Lagerbestand: ${purchasedItem.stockHistory.get(26)}');
                        }
                    }

                    if (orderDay >= 0 && orderDay < 5) {
                        this.logger.log(
                            'Neue Bestellung mit Modus 5 für Produkt ${purchasedItem.number}: Menge: ${discountQuantity}',
                        );
                        //das muss auch wieder ans Frontend
                        descriptionString += "Neue Bestellung mit Modus 5 für Produkt ${purchasedItem.number}: Menge: ${discountQuantity}";
                        orders.push(new OrderDto(
                            purchasedItem.number,
                            discountQuantity,
                            '5',
                            descriptionString
                        ));
                    } else if (orderDay < 0) {
                        this.logger.log("Neue Eilbestellung mit Modus 4 Produkt ${purchasedItem.number}: Menge: ${discountQuantity}");
                        descriptionString += "Neue Eilbestellung mit Modus 4 Produkt ${purchasedItem.number}: Menge: ${discountQuantity}";
                        orders.push(new OrderDto(
                            purchasedItem.number,
                            discountQuantity,
                            '4',
                            descriptionString
                        ));
                    }
                }
            }
            if (orders.length > 1) {
                let amount: number = 0;
                orders.forEach(order => {
                    amount += order.quantity;
                });
                newOrders.push(new OrderDto(
                    orders[0].article,
                    amount,
                    orders[0].modus,
                    "Mehrere Bestellungen für Kaufteil ${orders[0].article} mit Modus 5 in der gleichen Periode wurden zusammengeführt: Menge: ${amount}"
                    ));
            } else if (orders.length === 1) {
                newOrders.push(orders[0]);
            }
        }
        return newOrders;
    }
}
