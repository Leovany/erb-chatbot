import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from 'src/common/logger/logger.service';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerMiddleware,
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    middleware = module.get<LoggerMiddleware>(LoggerMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
