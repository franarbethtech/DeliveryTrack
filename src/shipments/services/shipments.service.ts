import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { Shipment } from '../models/shipment.model';

const ALLOWED_STATUS_TRANSITIONS: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  [ShipmentStatus.PENDING]: ShipmentStatus.PREPARING,
  [ShipmentStatus.PREPARING]: ShipmentStatus.SHIPPED,
  [ShipmentStatus.SHIPPED]: ShipmentStatus.DELIVERED,
};

@Injectable()
export class ShipmentsService {
  private readonly shipments: Shipment[] = [];

  create(createShipmentDto: CreateShipmentDto): Shipment {
    const duplicate = this.shipments.some(
      (shipment) => shipment.orderNumber === createShipmentDto.orderNumber,
    );

    if (duplicate) {
      throw new ConflictException(
        `Shipment with orderNumber ${createShipmentDto.orderNumber} already exists`,
      );
    }

    const now = new Date().toISOString();

    const shipment = new Shipment(
      randomUUID(),
      createShipmentDto.orderNumber,
      createShipmentDto.recipientName,
      createShipmentDto.address,
      createShipmentDto.commune,
      createShipmentDto.email,
      ShipmentStatus.PENDING,
      now,
      now,
    );

    this.shipments.push(shipment);

    return shipment;
  }

  findAll(status?: ShipmentStatus): Shipment[] {
    if (!status) {
      return this.shipments;
    }

    return this.shipments.filter((shipment) => shipment.status === status);
  }

  findOne(id: string): Shipment {
    const shipment = this.shipments.find((item) => item.id === id);

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    return shipment;
  }

  updateStatus(id: string, newStatus: ShipmentStatus): Shipment {
    const shipment = this.findOne(id);

    const currentStatus = shipment.status;
    const nextAllowedStatus = ALLOWED_STATUS_TRANSITIONS[currentStatus];

    if (nextAllowedStatus !== newStatus) {
      throw new ConflictException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    shipment.status = newStatus;
    shipment.updatedAt = new Date().toISOString();

    return shipment;
  }
}
