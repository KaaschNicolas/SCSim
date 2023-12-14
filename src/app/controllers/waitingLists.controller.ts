import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WaitingListService } from '../providers/waitingList.service';
import { WaitingListContainerDto } from '../dto/waitingListContainer.dto';

@Controller('waitingList')
export class WaitingListController {
    constructor(private readonly waitingListService: WaitingListService) {}

    @Post()
    create(@Body() waitingListContainerDto: WaitingListContainerDto) {
        return this.waitingListService.createWaitingList(waitingListContainerDto);
    }

    @Get(':workpaceId')
    findOne(@Param('id') id: string) {
        return this.waitingListService.getByWorkplace(+id);
    }
}
