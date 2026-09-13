import { Controller } from '@nestjs/common';
import { ShipmentsService } from '../services/shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
}
