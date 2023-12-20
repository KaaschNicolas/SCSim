import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { PurchasedItemContainerDto } from '../dto/purchasedItemContainer.dto';

@Injectable()
export class PurchasedItemService {
    private readonly logger;

    constructor(
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemsRepository: Repository<PurchasedItem>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger();
    }

    public async upsertPurchasedItems(purchasedItemContainerDto: PurchasedItemContainerDto) {
        this.logger.log('upsertPurchasedItems');
        purchasedItemContainerDto.purchasedItems.forEach(async (it) => {
            let purchasedItem = new PurchasedItem(it);
            await this.entityManager.save(purchasedItem);
        });
    }
}
