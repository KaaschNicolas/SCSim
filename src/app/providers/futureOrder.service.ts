import { FutureOrder } from "src/entity/futureOrder.entity";
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { FutureOrderDto } from "../dto/futureOrder.dto";
import { PurchasedItem } from "src/entity/purchasedItem.entity";

@Injectable()
export class FutureOrderService {
    private readonly logger;

    constructor(
        @InjectRepository(FutureOrder)
        private readonly futureOrderRepository: Repository<FutureOrder>,
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemRepository: Repository<PurchasedItem>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(FutureOrderService.name);
    }

    public async insert(futureOrderDto: FutureOrderDto[]) {
        await this.clear();
        this.logger.log('Inserting ItemsFutureOrders');
        for (let futureOrder of futureOrderDto) {
            let purchasedItem = await this.purchasedItemRepository.findOne({
                where: {
                    number: futureOrder.purchasedItemId,
                },
            })
            await this.futureOrderRepository.save(new FutureOrder(
                {
                    orderPeriod: futureOrder.orderPeriod,
                    purchasedItem: purchasedItem,
                    mode: futureOrder.mode,
                    amount: futureOrder.amount,
                }
            ));
        }
    }
    public async clear() {
        await this.futureOrderRepository.clear();
    }
}
        