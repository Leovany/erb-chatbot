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

  debug(message: string, meta?: any) {
    this.logger.debug(message, { ...meta, context: this.context });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, { ...meta, context: this.context });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, { ...meta, context: this.context });
  }

  error(message: string, meta?: any) {
    this.logger.error(message, { ...meta, context: this.context });
  }

  log(message: string, meta?: any) {
    this.logger.info(message, { ...meta, context: this.context });
  }
}

