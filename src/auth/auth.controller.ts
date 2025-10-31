import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
// import {SkipAuth} from './auth/decorators/public.decorator'
import { SkipAuth } from "./decorators/skipauth.decorator";
import { LoggerService } from "../common/logger/logger.service";
import { SignInDTO } from "./dto/signin.dto"; 
import { ApiTags, ApiOperation, ApiResponse, ApiParam,ApiBody } from '@nestjs/swagger';
/**
 * 权限校验模块
 *
 * 技术点：
 *   1. 全局验证配置：xxxModule.ts @SkipAuth(),{provide: APP_GUARD,useClass:AuthGuard}
 *   2. @SkipAuth() 自定义装饰器，设置不用验证，
 */
@Controller("auth")
export class AuthController {
  constructor(
    private readonly logger: LoggerService,
    private authService: AuthService,
  ) {
    // 自动设置类名
    this.logger.setContext(AuthController.name);
  }

  @SkipAuth() // 设置不用验证，
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiBody({ type: SignInDTO })
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

}
