import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

//internal Imports
import { winstonLogger } from '../logger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './interceptors/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('all the api to use Task Manager')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
