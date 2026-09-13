import { Module } from '@nestjs/common';
import { ShipmentsController } from './controllers/shipments.controller';
import { ShipmentsService } from './services/shipments.service';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
})
export class ShipmentsModule {}
