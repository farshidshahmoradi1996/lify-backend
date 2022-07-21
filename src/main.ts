import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //middleware
  app.enableCors();
  app.use(helmet());

  //auto validation
  app.useGlobalPipes(new ValidationPipe());

  //config swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('lify')
    .setDescription('lify API description')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  //start app
  await app.listen(3000);
}

bootstrap();
