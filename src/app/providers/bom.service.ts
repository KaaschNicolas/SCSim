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

    public async createItems(itemContainerDto: ItemContainerDto) {
        itemContainerDto.itemList.forEach(async (it) => {
            let item = new Item(it);
            await this.entityManager.save(item);
        });
    }

    public async findAll() {
        return await this.itemRepository.find();
    }

    public async findOne(itemNumber: number) {
        return await this.itemRepository.findOneBy({ itemNumber });
    }
}
