import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { PurchasedItemDto } from '../dto/purchasedItem.dto';

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

    public async upsertPurchasedItems(purchasedItemDtoList: PurchasedItemDto[]) {
        this.logger.log('upsertPurchasedItems');
        purchasedItemDtoList.forEach(async (it) => {
            let purchasedItem = new PurchasedItem(it);
            await this.purchasedItemsRepository.save(purchasedItem);
        });
    }
}
