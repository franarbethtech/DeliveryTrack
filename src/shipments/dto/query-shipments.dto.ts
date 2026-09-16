import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class QueryShipmentsDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;
}
