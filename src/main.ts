import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DeliveryTrack API')
    .setDescription(
      'API REST para la gestión de envíos de DeliveryTrack. Permite crear, ' +
        'consultar y gestionar el estado de los envíos durante su ciclo de vida.',
    )
    .setVersion('1.0')
    .addTag(
      'shipments',
      'Operaciones para creación, consulta y gestión de estados de envíos.',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
