import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ShipmentStatusPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    return value;
  }
}
