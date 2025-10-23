import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';  // 确保这里正确导入
import { Question, QuestionSchema } from './question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],  // 如果需要在其他模块使用，添加这行
})
export class QuestionModule {}