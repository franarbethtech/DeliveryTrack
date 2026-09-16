import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class ShipmentListResponseDto {
  @ApiProperty({
    description: 'Identificador único del envío.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador externo de la orden asociada al envío.',
    example: 'ORD-0001',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Nombre de la persona que recibirá el envío.',
    example: 'Juan Pérez',
  })
  recipientName: string;

  @ApiProperty({
    description: 'Comuna correspondiente a la dirección de entrega.',
    example: 'Las Condes',
  })
  commune: string;

  @ApiProperty({
    description: 'Estado actual del envío.',
    enum: ShipmentStatus,
    example: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @ApiProperty({
    description: 'Fecha y hora de creación del envío.',
    format: 'date-time',
    example: '2026-09-16T01:03:01.000Z',
  })
  createdAt: string;
}
