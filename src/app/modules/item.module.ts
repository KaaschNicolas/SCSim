import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Item } from 'src/entity/item.entity';
import { ItemController } from '../controllers/items.controller';
import { ItemService } from '../providers/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingListModule } from './waitingList.module';
import { WaitingListService } from '../providers/waitingList.service';
import { WaitingList } from 'src/entity/waitingList.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Item, WaitingList]), WaitingListModule],
    controllers: [ItemController],
    providers: [ItemService, WaitingListService],
})
export class ItemModule {}
