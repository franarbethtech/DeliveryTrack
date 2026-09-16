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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { QueryShipmentsDto } from '../dto/query-shipments.dto';
import { ShipmentDetailResponseDto } from '../dto/shipment-detail-response.dto';
import { ShipmentListResponseDto } from '../dto/shipment-list-response.dto';
import { UpdateShipmentStatusDto } from '../dto/update-shipment-status.dto';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { Shipment } from '../models/shipment.model';
import { ShipmentsService } from '../services/shipments.service';

@ApiTags('shipments')
@ApiProduces('application/json')
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @ApiOperation({
    operationId: 'createShipment',
    summary: 'Crear un nuevo envío',
    description:
      'Crea un envío nuevo y lo almacena en memoria. El campo "id" se ' +
      'genera automáticamente (UUID v4), el estado inicial siempre es ' +
      'PENDING y "createdAt"/"updatedAt" se generan automáticamente con el ' +
      'mismo valor. El cliente no puede elegir el estado inicial. ' +
      '"orderNumber" debe ser único entre los envíos existentes.',
  })
  @ApiBody({ type: CreateShipmentDto })
  @ApiCreatedResponse({
    description: 'Envío creado correctamente.',
    type: ShipmentDetailResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Datos de entrada inválidos: campos faltantes, email inválido, ' +
      'formato de orderNumber incorrecto (no cumple ORD-XXXX) o propiedades ' +
      'no permitidas en el cuerpo de la solicitud.',
    schema: {
      example: {
        statusCode: 400,
        message: ['orderNumber must match the format ORD-XXXX (4 digits)'],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Ya existe un envío con el mismo orderNumber.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Shipment with orderNumber ORD-0001 already exists',
        error: 'Conflict',
      },
    },
  })
  create(
    @Body() createShipmentDto: CreateShipmentDto,
  ): ShipmentDetailResponseDto {
    const shipment = this.shipmentsService.create(createShipmentDto);
    return this.toDetailResponse(shipment);
  }

  @Get()
  @ApiOperation({
    operationId: 'listShipments',
    summary: 'Listar envíos',
    description:
      'Retorna todos los envíos almacenados en memoria. Si se especifica ' +
      'el parámetro "status", la colección se filtra por ese estado; el ' +
      'filtro no distingue mayúsculas de minúsculas. El almacenamiento es ' +
      'actualmente en memoria (los datos se pierden al reiniciar el proceso).',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ShipmentStatus,
    example: ShipmentStatus.PENDING,
    description:
      'Filtra los envíos por estado. El valor no distingue mayúsculas de ' +
      'minúsculas.',
  })
  @ApiOkResponse({
    description: 'Colección de envíos (resumida).',
    type: ShipmentListResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El valor de "status" no corresponde a un ShipmentStatus válido.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'status must be one of the following values: PENDING, PREPARING, SHIPPED, DELIVERED, CANCELLED',
        ],
        error: 'Bad Request',
      },
    },
  })
  findAll(@Query() query: QueryShipmentsDto): ShipmentListResponseDto[] {
    const shipments = this.shipmentsService.findAll(query.status);
    return shipments.map((shipment) => this.toListResponse(shipment));
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getShipmentById',
    summary: 'Obtener un envío por identificador',
    description:
      'Retorna el detalle completo de un envío a partir de su identificador.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 del envío.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Envío encontrado.',
    type: ShipmentDetailResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El parámetro "id" no tiene formato de UUID v4 válido.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (uuid v 4 is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'El UUID es válido pero no existe ningún envío con ese id.',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Shipment with id 11111111-1111-4111-8111-111111111111 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): ShipmentDetailResponseDto {
    const shipment = this.shipmentsService.findOne(id);
    return this.toDetailResponse(shipment);
  }

  @Patch(':id/status')
  @ApiOperation({
    operationId: 'updateShipmentStatus',
    summary: 'Actualizar el estado de un envío',
    description:
      'Aplica una transición de estado sobre un envío existente. El flujo ' +
      'normal es PENDING -> PREPARING -> SHIPPED -> DELIVERED y solo se ' +
      'permite avanzar exactamente al siguiente estado de la secuencia ' +
      '(por ejemplo, PENDING -> SHIPPED, PREPARING -> DELIVERED o ' +
      'DELIVERED -> PREPARING son inválidas). CANCELLED no es alcanzable ' +
      'a través de esta operación.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 del envío.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateShipmentStatusDto })
  @ApiOkResponse({
    description: 'Estado actualizado correctamente.',
    type: ShipmentDetailResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'UUID inválido, valor de estado no reconocido (fuera de ' +
      'ShipmentStatus) o cuerpo de la solicitud malformado.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'status must be one of the following values: PENDING, PREPARING, SHIPPED, DELIVERED, CANCELLED',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'El UUID es válido pero no existe ningún envío con ese id.',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Shipment with id 11111111-1111-4111-8111-111111111111 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description:
      'Transición de negocio inválida: no es el siguiente estado permitido, ' +
      'es una transición al mismo estado, se solicita CANCELLED, o el envío ' +
      'ya se encuentra en el estado terminal DELIVERED.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Invalid status transition from PENDING to SHIPPED',
        error: 'Conflict',
      },
    },
  })
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
