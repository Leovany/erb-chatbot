import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('CT289DS006-Chatbot API')
    .setDescription('The chatbot API description')
    .setVersion('1.0')
    .addTag('Chatbot')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix("api");   // 所有路由添加 /api 前缀
  await app.listen(process.env.PORT ?? 3000);  

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  

  console.log("应用运行在: http://localhost:3000");
}
bootstrap();
