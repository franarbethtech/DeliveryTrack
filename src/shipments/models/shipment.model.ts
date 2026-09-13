import { ShipmentStatus } from '../enums/shipment-status.enum';

export class Shipment {
  constructor(
    public id: string,
    public orderNumber: string,
    public recipientName: string,
    public address: string,
    public commune: string,
    public email: string,
    public status: ShipmentStatus,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
