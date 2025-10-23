import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(LoggerMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // 记录请求信息
    const requestInfo: any = {
      method,
      url: originalUrl,
      ip,
      userAgent,
    };

    // 添加请求参数
    if (req.body && Object.keys(req.body).length > 0) {
      requestInfo.body = req.body;
    }
    if (req.query && Object.keys(req.query).length > 0) {
      requestInfo.query = req.query;
    }
    if (req.params && Object.keys(req.params).length > 0) {
      requestInfo.params = req.params;
    }

    this.logger.info(`请求开始`, requestInfo);

    // 监听响应结束
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const responseInfo = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
      };

      // 根据状态码选择日志级别
      if (statusCode >= 500) {
        this.logger.error(`请求完成`, responseInfo);
      } else if (statusCode >= 400) {
        this.logger.warn(`请求完成`, responseInfo);
      } else {
        this.logger.info(`请求完成`, responseInfo);
      }
    });

    next();
  }
}
