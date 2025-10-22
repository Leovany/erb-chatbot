import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);