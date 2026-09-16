import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class UpdateShipmentStatusDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
}
