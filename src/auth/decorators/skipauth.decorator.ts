// 声明路由为公共
import { SetMetadata } from "@nestjs/common";

// 元数据键
export const IS_PUBLIC_KEY = "isSkipAuth";
// 装饰器
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
