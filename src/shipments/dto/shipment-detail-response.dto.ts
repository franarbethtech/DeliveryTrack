import { ShipmentStatus } from '../enums/shipment-status.enum';

export class ShipmentDetailResponseDto {
  id: string;
  orderNumber: string;
  recipientName: string;
  address: string;
  commune: string;
  email: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}
