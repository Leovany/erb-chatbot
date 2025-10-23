import { Module,NestModule ,MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { WinstonModule } from 'nest-winston';
import { QuestionModule } from './question/question.module';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
//import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './scripts/seed-data';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    LoggerModule,
    QuestionModule,
    ProductModule,
    ShopModule,
    ConfigModule.forRoot(),
    // MongooseModule.forRoot('mongodb://localhost:27017/chatbot-db', {
    //   retryAttempts: 3,
    //   retryDelay: 1000,
    // }),
    WinstonModule.forRoot({
      // 日志格式配置
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),

      transports: [
        // 控制台输出（开发环境）
        new winston.transports.Console({
          level: 'debug', // 显示 debug 及以上级别的日志
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => {
              const { timestamp, level, message, context, stack, data, ...rest } = info;
              const contextStr = context ? `[${context}] ` : '';
              
              // 如果只有 data 字段，直接拼接到 message 后面
              if (data !== undefined && Object.keys(rest).length === 0) {
                return `${timestamp} ${contextStr}${level}: ${message} ${data}${stack ? '\n' + stack : ''}`;
              }
              
              // 如果有其他字段，显示为 JSON
              const allRest = data !== undefined ? { data, ...rest } : rest;
              const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
              return `${timestamp} ${contextStr}${level}: ${message}${metaStr}${stack ? '\n' + stack : ''}`;
            }),
          ),
        }),

        // Debug 级别日志 - 按日期轮转
        new winston.transports.DailyRotateFile({
          level: 'debug',
          dirname: 'logs',
          filename: 'debug-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,  // 压缩旧日志
          maxSize: '20m',       // 单个文件最大 20MB
          maxFiles: '7d',       // 保留 7 天
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss', 
            }),
            winston.format.printf((info) => {
              const { level, message, timestamp, context, data, ...rest } = info;
              const contextStr = context ? `[${context}] ` : '';
              
              // 如果只有 data 字段，直接拼接到 message 后面
              if (data !== undefined && Object.keys(rest).length === 0) {
                return `${timestamp} ${contextStr}${level}: ${message} ${data}`;
              }
              
              // 如果有其他字段，显示为 JSON
              const allRest = data !== undefined ? { data, ...rest } : rest;
              const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
              return `${timestamp} ${contextStr}${level}: ${message}${metaStr}`;
            })
          ),
        }),

        // Info 级别日志 - 按日期轮转
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',      // 保留 14 天

            format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss', 
            }),
            winston.format((info) => {
                if (info.level === "error") {
                    return false; // 过滤掉'error'级别的日志
                }
                return info;
            })(),
            winston.format.printf((info) => {
                const { level, message, timestamp, context, data, ...rest } = info;
                const contextStr = context ? `[${context}] ` : '';
                
                // 如果只有 data 字段，直接拼接到 message 后面
                if (data !== undefined && Object.keys(rest).length === 0) {
                  return `${timestamp} ${contextStr}${level}: ${message} ${data}`;
                }
                
                // 如果有其他字段，显示为 JSON
                const allRest = data !== undefined ? { data, ...rest } : rest;
                const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
                return `${timestamp} ${contextStr}${level}: ${message}${metaStr}`;
            })
        )
        }),

        // Warn 级别日志 - 按日期轮转
        new winston.transports.DailyRotateFile({
          level: 'warn',
          dirname: 'logs',
          filename: 'warn-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',      // 保留 30 天
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss', 
            }),
            winston.format.printf((info) => {
              const { level, message, timestamp, context, data, ...rest } = info;
              const contextStr = context ? `[${context}] ` : '';
              
              // 如果只有 data 字段，直接拼接到 message 后面
              if (data !== undefined && Object.keys(rest).length === 0) {
                return `${timestamp} ${contextStr}${level}: ${message} ${data}`;
              }
              
              // 如果有其他字段，显示为 JSON
              const allRest = data !== undefined ? { data, ...rest } : rest;
              const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
              return `${timestamp} ${contextStr}${level}: ${message}${metaStr}`;
            })
          ),
        }),

        // Error 级别日志 - 按日期轮转
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: 'logs',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',      // 保留 30 天
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss', 
            }),
            winston.format.errors({ stack: true }),
            winston.format.printf((info) => {
              const { level, message, timestamp, context, stack, data, ...rest } = info;
              const contextStr = context ? `[${context}] ` : '';
              const stackStr = stack ? `\n${stack}` : '';
              
              // 如果只有 data 字段，直接拼接到 message 后面
              if (data !== undefined && Object.keys(rest).length === 0) {
                return `${timestamp} ${contextStr}${level}: ${message} ${data}${stackStr}`;
              }
              
              // 如果有其他字段，显示为 JSON
              const allRest = data !== undefined ? { data, ...rest } : rest;
              const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
              return `${timestamp} ${contextStr}${level}: ${message}${metaStr}${stackStr}`;
            })
          ),
        }),

        // 所有日志（combined）- 按日期轮转
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss', 
            }),
            winston.format.printf((info) => {
              const { level, message, timestamp, context, data, ...rest } = info;
              const contextStr = context ? `[${context}] ` : '';
              
              // 如果只有 data 字段，直接拼接到 message 后面
              if (data !== undefined && Object.keys(rest).length === 0) {
                return `${timestamp} ${contextStr}${level}: ${message} ${data}`;
              }
              
              // 如果有其他字段，显示为 JSON
              const allRest = data !== undefined ? { data, ...rest } : rest;
              const metaStr = Object.keys(allRest).length ? ` ${JSON.stringify(allRest)}` : '';
              return `${timestamp} ${contextStr}${level}: ${message}${metaStr}`;
            })
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule implements NestModule{ 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}