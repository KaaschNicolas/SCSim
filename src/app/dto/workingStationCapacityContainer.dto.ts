import { WorkingStationCapacityDto } from './workingStationCapacity.dto';

/**
 * DTO um alle Informationen für die Darstellung des Kapazitätsbedarf darstellen zu können
 */
export class WorkingStationCapacityContainerDto {
    public workingStationCapacities: WorkingStationCapacityDto[];

    public constructor() {
        this.workingStationCapacities = [
            new WorkingStationCapacityDto(1),
            new WorkingStationCapacityDto(2),
            new WorkingStationCapacityDto(3),
            new WorkingStationCapacityDto(4),
            new WorkingStationCapacityDto(5),
            new WorkingStationCapacityDto(6),
            new WorkingStationCapacityDto(7),
            new WorkingStationCapacityDto(8),
            new WorkingStationCapacityDto(9),
            new WorkingStationCapacityDto(10),
            new WorkingStationCapacityDto(11),
            new WorkingStationCapacityDto(12),
            new WorkingStationCapacityDto(13),
            new WorkingStationCapacityDto(14),
            new WorkingStationCapacityDto(15),
        ];
    }
}
