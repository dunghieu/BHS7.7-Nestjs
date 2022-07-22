import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConstants } from './constants/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(appConstants.APP_NAME)
    .setDescription(appConstants.APP_DESCRIPTION)
    .setVersion(appConstants.APP_VERSION)
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (methodKey: string, controllerKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

console.log('asd');
