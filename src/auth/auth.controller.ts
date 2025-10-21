import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
// import {SkipAuth} from './auth/decorators/public.decorator'
import { SkipAuth } from './decorators/skipauth.decorator';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


/**
 * 权限校验模块
 * 
 * 技术点：
 *   1. 全局验证配置：xxxModule.ts @SkipAuth(),{provide: APP_GUARD,useClass:AuthGuard}
 *   2. @SkipAuth() 自定义装饰器，设置不用验证， 
 */
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private authService: AuthService
    ) { }

    @SkipAuth()     // 设置不用验证，
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        console.log('signInDto', signInDto.username);
        this.logger.debug('debug signIn', signInDto.username);
        this.logger.info('info signIn', { username: signInDto.username });
        this.logger.warn('warn signIn', { username: signInDto.username });
        this.logger.error('error signIn', { username: signInDto.username });
        return this.authService.signIn(signInDto.username, signInDto.password);
    }


    // 测试接口
    // @UseGuards(AuthGuard) 
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }

}
