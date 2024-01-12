import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WaitingListService } from '../providers/waitingList.service';
import { WaitingListDto } from '../dto/waitingList.dto';

@Controller('waitingList')
export class WaitingListController {
    constructor(private readonly waitingListService: WaitingListService) {}

    @Post()
    create(@Body() waitingListDtoList: WaitingListDto[]) {
        return this.waitingListService.createWaitingList(waitingListDtoList);
    }

    @Get(':workpaceId')
    findOne(@Param('id') id: string) {
        return this.waitingListService.getByWorkplace(+id);
    }
}
