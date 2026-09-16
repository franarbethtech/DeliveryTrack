import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^ORD-\d{4}$/, {
    message: 'orderNumber must match the format ORD-XXXX (4 digits)',
  })
  orderNumber: string;

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  commune: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
