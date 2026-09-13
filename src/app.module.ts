import { Module } from '@nestjs/common';
import { ShipmentsModule } from './shipments/shipments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [ShipmentsModule, NotificationsModule],
  
})
export class AppModule {}
