import { Injectable } from '@nestjs/common';
import { ForecastContainerDto, ForecastDto, ItemContainerDto, ItemDto } from '../dto';
import { ItemContainer } from 'src/entity';


@Injectable()
export class BomService {

    public disolveBom(forecast: ForecastContainerDto, itemContainer: ItemContainerDto): ItemContainer {

        itemContainer.itemList.forEach(element => {
            switch (element.itemNumber) {
                case 26:
                    element.isMultiple = true;
                    this.calculateProductionOrder(element, forecast);
                    break;
                case 51:
                    this.calculateProductionOrder(element, forecast[0]);
                case 16:
                    element.isMultiple = true;
                    this.calculateProductionOrder(element, forecast);
                case 17:
                    element.isMultiple = true;
                    this.calculateProductionOrder(element, forecast);
                case 50:
                    this.calculateProductionOrder(element, forecast[0]);
                case 4:
                    this.calculateProductionOrder(element, forecast[0]);
                case 10:
                    this.calculateProductionOrder(element, forecast[0]);
                case 49:
                    this.calculateProductionOrder(element, forecast[0]);
                case 7:
                    this.calculateProductionOrder(element, forecast[0]);
                case 13:
                    this.calculateProductionOrder(element, forecast[0]);
                case 18:
                    this.calculateProductionOrder(element, forecast[0]);
                case 56:
                    this.calculateProductionOrder(element, forecast[1]);
                case 55:
                    this.calculateProductionOrder(element, forecast[1]);
                case 5:
                    this.calculateProductionOrder(element, forecast[1]);
                case 11:
                    this.calculateProductionOrder(element, forecast[1]);
                case 54:
                    this.calculateProductionOrder(element, forecast[1]);
                case 8:
                    this.calculateProductionOrder(element, forecast[1]);
                case 14:
                    this.calculateProductionOrder(element, forecast[1]);
                case 19:
                    this.calculateProductionOrder(element, forecast[1]);
                case 31:
                    this.calculateProductionOrder(element, forecast[2]);
                case 30:
                    this.calculateProductionOrder(element, forecast[2]);
                case 6:
                    this.calculateProductionOrder(element, forecast[2]);
                case 12:
                    this.calculateProductionOrder(element, forecast[2]);
                case 29:
                    this.calculateProductionOrder(element, forecast[2]);
                case 9:
                    this.calculateProductionOrder(element, forecast[2]);
                case 15:
                    this.calculateProductionOrder(element, forecast[2]);
                case 20:
                    this.calculateProductionOrder(element, forecast[2]);
                default:
                    break;
            }
        });
    }

    public calculateProductionOrder(itemDto: ItemDto, forecast?: ForecastContainerDto, forecastDto?: ForecastDto) {
        if (itemDto.isMultiple) {
            itemDto.productionOrder = itemDto.safetyStock - itemDto.warehouseStock;
            forecast.forecasts.forEach(it => itemDto.productionOrder += it.forecast);
        } else {
            itemDto.productionOrder = forecastDto.forecast + itemDto.safetyStock - itemDto.warehouseStock
        }
    }
}