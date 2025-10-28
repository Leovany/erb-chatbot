import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ 
  collection: 'shop',
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
})
export class Shop {
  @Prop({ required: true, unique: true })
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

  // 地理空间字段
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  })
  location: {
    type: string;
    coordinates: number[];
  };
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

// 创建地理空间索引
ShopSchema.index({ location: '2dsphere' });
ShopSchema.index({ id: 1 }, { unique: true });
ShopSchema.index({ shopName: 1 });