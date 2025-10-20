import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "./decorators/skipauth.decorator";
import { Reflector } from '@nestjs/core';

/**
 * 用户登录校验
 */
@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private jwtService:JwtService,
        private reflector: Reflector
    ){}

    async canActivate(context : ExecutionContext): Promise<boolean> {
        
        // 全局守卫
        const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);
        if(isSkipAuth){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret:jwtConstants.secret
                }
            );
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;

    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}   