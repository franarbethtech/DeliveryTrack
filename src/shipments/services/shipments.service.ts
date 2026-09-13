import { Injectable } from '@nestjs/common';
import { Shipment } from '../models/shipment.model';

@Injectable()
export class ShipmentsService {
  private readonly shipments: Shipment[] = [];
}
