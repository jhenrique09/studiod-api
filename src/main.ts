import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );
  if (parseInt(process.env.DEV) == 1) {
    const config = new DocumentBuilder()
      .setTitle('StudioD API')
      .setDescription('Rest API para o aplicativo StudioD')
      .setVersion('1.0')
      .addTag('usuarios')
      .addTag('estabelecimentos')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const swaggerCustomOptions = {
      customCss: '.swagger-ui section.models { visibility: hidden;}',
    };
    SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);
  }
  await app.listen(3000);
}
bootstrap();
