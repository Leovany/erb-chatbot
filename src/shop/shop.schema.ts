import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'shop' })  // 明确指定集合名称
export class Shop {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  shopName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  openingHour: string;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);