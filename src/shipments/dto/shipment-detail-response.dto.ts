import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class ShipmentDetailResponseDto {
  @ApiProperty({
    description: 'Identificador único del envío, generado automáticamente.',
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
    description: 'Dirección de entrega del envío.',
    example: 'Av. Apoquindo 1234',
  })
  address: string;

  @ApiProperty({
    description: 'Comuna correspondiente a la dirección de entrega.',
    example: 'Las Condes',
  })
  commune: string;

  @ApiProperty({
    description: 'Correo electrónico utilizado como contacto del destinatario.',
    format: 'email',
    example: 'juan@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Estado actual del envío.',
    enum: ShipmentStatus,
    example: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @ApiProperty({
    description: 'Momento en que se creó el envío.',
    format: 'date-time',
    example: '2026-09-16T01:03:01.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Momento de la actualización más reciente del envío.',
    format: 'date-time',
    example: '2026-09-16T01:03:01.000Z',
  })
  updatedAt: string;
}
