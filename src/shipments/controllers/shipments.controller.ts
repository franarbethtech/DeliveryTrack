import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { QueryShipmentsDto } from '../dto/query-shipments.dto';
import { ShipmentDetailResponseDto } from '../dto/shipment-detail-response.dto';
import { ShipmentListResponseDto } from '../dto/shipment-list-response.dto';
import { UpdateShipmentStatusDto } from '../dto/update-shipment-status.dto';
import { Shipment } from '../models/shipment.model';
import { ShipmentsService } from '../services/shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  create(
    @Body() createShipmentDto: CreateShipmentDto,
  ): ShipmentDetailResponseDto {
    const shipment = this.shipmentsService.create(createShipmentDto);
    return this.toDetailResponse(shipment);
  }

  @Get()
  findAll(@Query() query: QueryShipmentsDto): ShipmentListResponseDto[] {
    const shipments = this.shipmentsService.findAll(query.status);
    return shipments.map((shipment) => this.toListResponse(shipment));
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): ShipmentDetailResponseDto {
    const shipment = this.shipmentsService.findOne(id);
    return this.toDetailResponse(shipment);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateShipmentStatusDto: UpdateShipmentStatusDto,
  ): ShipmentDetailResponseDto {
    const shipment = this.shipmentsService.updateStatus(
      id,
      updateShipmentStatusDto.status,
    );
    return this.toDetailResponse(shipment);
  }

  private toListResponse(shipment: Shipment): ShipmentListResponseDto {
    return {
      id: shipment.id,
      orderNumber: shipment.orderNumber,
      recipientName: shipment.recipientName,
      commune: shipment.commune,
      status: shipment.status,
      createdAt: shipment.createdAt,
    };
  }

  private toDetailResponse(shipment: Shipment): ShipmentDetailResponseDto {
    return {
      id: shipment.id,
      orderNumber: shipment.orderNumber,
      recipientName: shipment.recipientName,
      address: shipment.address,
      commune: shipment.commune,
      email: shipment.email,
      status: shipment.status,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };
  }
}
