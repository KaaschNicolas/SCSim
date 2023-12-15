import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Item } from 'src/entity/item.entity';
import { ItemController } from '../controllers/items.controller';
import { ItemService } from '../providers/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Item])],
    controllers: [ItemController],
    providers: [ItemService],
})
export class ItemModule {}
