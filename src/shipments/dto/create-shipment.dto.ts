import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({
    description:
      'Identificador externo único de la orden asociada al envío. ' +
      'Debe seguir el formato ORD- seguido de exactamente 4 dígitos numéricos.',
    example: 'ORD-0001',
    pattern: '^ORD-\\d{4}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^ORD-\d{4}$/, {
    message: 'orderNumber must match the format ORD-XXXX (4 digits)',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Nombre de la persona que recibirá el envío.',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiProperty({
    description: 'Dirección de entrega del envío.',
    example: 'Av. Apoquindo 1234',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Comuna correspondiente a la dirección de entrega.',
    example: 'Las Condes',
  })
  @IsString()
  @IsNotEmpty()
  commune: string;

  @ApiProperty({
    description: 'Correo electrónico utilizado como contacto del destinatario.',
    example: 'juan@example.com',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
