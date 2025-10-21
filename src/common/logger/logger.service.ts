import { Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  setContext(context: string) {
    this.context = context;
  }

  private formatMeta(meta?: any): any {
    if (meta === undefined || meta === null) {
      return { context: this.context };
    }
    
    // 如果是对象（不包括数组），展开它
    if (typeof meta === 'object' && !Array.isArray(meta)) {
      return { ...meta, context: this.context };
    }
    
    // 如果是字符串、数字、布尔值、数组等，作为 data 字段
    return { data: meta, context: this.context };
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, this.formatMeta(meta));
  }

  info(message: string, meta?: any) {
    this.logger.info(message, this.formatMeta(meta));
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, this.formatMeta(meta));
  }

  error(message: string, meta?: any) {
    this.logger.error(message, this.formatMeta(meta));
  }

  log(message: string, meta?: any) {
    this.logger.info(message, this.formatMeta(meta));
  }
}

