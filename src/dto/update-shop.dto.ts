import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateShopDto extends PartialType(CreateShopDto) {
  @IsOptional()
  @IsNumber({}, { message: '分店ID必须是数字' })
  id?: number;

  @IsOptional()
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  lat?: number;

  @IsOptional()
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  lng?: number;
}