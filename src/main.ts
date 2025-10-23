import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api"); // 所有路由添加 /api 前缀
  await app.listen(3000);
  console.log("应用运行在: http://localhost:3000");
}
bootstrap();
