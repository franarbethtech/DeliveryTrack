import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class UpdateShipmentStatusDto {
  @ApiProperty({
    description:
      'Estado destino solicitado para el envío. El flujo normal de ' +
      'transición es PENDING -> PREPARING -> SHIPPED -> DELIVERED; solo se ' +
      'permite avanzar exactamente al siguiente estado de la secuencia. ' +
      'CANCELLED forma parte de ShipmentStatus pero no puede alcanzarse a ' +
      'través de esta operación (la cancelación será una operación separada).',
    enum: ShipmentStatus,
    example: ShipmentStatus.PREPARING,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
}
