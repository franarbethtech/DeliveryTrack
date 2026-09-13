import { ShipmentStatus } from '../enums/shipment-status.enum';

export class ShipmentListResponseDto {
  id: string;
  orderNumber: string;
  recipientName: string;
  commune: string;
  status: ShipmentStatus;
  createdAt: string;
}
