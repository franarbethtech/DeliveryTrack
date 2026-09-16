import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class QueryShipmentsDto {
  @ApiPropertyOptional({
    description:
      'Filtro opcional por estado del envío. Si se omite, se retornan todos ' +
      'los envíos. La comparación no distingue mayúsculas de minúsculas ' +
      '(por ejemplo, "shipped", "Shipped" y "SHIPPED" son equivalentes).',
    enum: ShipmentStatus,
    example: ShipmentStatus.SHIPPED,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;
}
