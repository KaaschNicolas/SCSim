import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ItemContainerDto } from '../dto';
import { Item } from 'src/entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BomService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly entityManager: EntityManager,
    ) {}

    public async upsertItems(itemContainerDto: ItemContainerDto) {
        itemContainerDto.itemList.forEach(async (it) => {
            let item = new Item(it);
            await this.entityManager.save(item);
        });
    }

    public async findOne(itemNumber: number) {
        return await this.itemRepository.findOneBy({ itemNumber });
    }

    public async findAll() {
        this.resolveBom();
        return await this.itemRepository.find();
    }

    private async resolveBom() {
        //BOM logic here
        let products = await this.itemRepository.find({
            where: [{ itemNumber: 1 }, { itemNumber: 2 }, { itemNumber: 3 }],
        });

        //productionOrder for p1, p2, p3 must be prefilled (forecast)
        products.forEach(async (item) => {
            await this.resolveChildren(item, item.productionOrder);
        });
    }

    private async resolveChildren(item: Item, parentProdctionOrder: number) {
        //await this.setChildrenProductionOrder(item);
        item.productionOrder = parentProdctionOrder;
        item.productionOrder += item.safetyStock - item.warehouseStock - item.waitingQueue - item.workInProgress;
        await this.entityManager.save(item);

        let childreen = await this.entityManager.getTreeRepository(Item).findDescendants(item);

        childreen.forEach(async (child) => {
            if (child === null) {
                return;
            }

            await this.resolveChildren(child, item.productionOrder);
        });
    }
}
