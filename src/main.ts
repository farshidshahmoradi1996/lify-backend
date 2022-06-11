import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //middleware
  app.enableCors();
  app.use(helmet());

  //interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  //config swagger

  const config = new DocumentBuilder()
    .setTitle('ananas')
    .setDescription('ananas API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
