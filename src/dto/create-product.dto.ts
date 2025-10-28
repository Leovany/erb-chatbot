import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: '产品ID', example: 1001 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '品牌名称', example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({ description: '产品类别', example: '智能手机' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: '产品名称', example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: '价格', example: 9999 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '产品描述', example: '6.1 时超视网膜 XDR 显示器' })
  @IsString()
  @IsNotEmpty()
  description: string;
}