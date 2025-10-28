import { IsNotEmpty, IsNumber, IsString, IsPhoneNumber, Min, Max } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty({ message: '分店ID不能为空' })
  @IsNumber({}, { message: '分店ID必须是数字' })
  id: number;

  @IsNotEmpty({ message: '区域不能为空' })
  @IsString({ message: '区域必须是字符串' })
  region: string;

  @IsNotEmpty({ message: '分店名称不能为空' })
  @IsString({ message: '分店名称必须是字符串' })
  shopName: string;

  @IsNotEmpty({ message: '地址不能为空' })
  @IsString({ message: '地址必须是字符串' })
  address: string;

  @IsNotEmpty({ message: '电话号码不能为空' })
  @IsNumber({}, { message: '电话号码必须是数字' })
  phone: number;

  @IsNotEmpty({ message: '营业时间不能为空' })
  @IsString({ message: '营业时间必须是字符串' })
  openingHour: string;

  @IsNotEmpty({ message: '纬度不能为空' })
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  lat: number;

  @IsNotEmpty({ message: '经度不能为空' })
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  lng: number;
}