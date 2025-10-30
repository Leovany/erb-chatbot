import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @SkipAuth()
  @Get()
  async getAllQuestions() {
    const questions = await this.questionService.findAll();
    return {
      success: true,
      data: questions,
      count: questions.length,
      message: '获取问答列表成功'
    };
  }

  @SkipAuth()
  @Get('next-id')
  async getNextId() {
    const nextId = await this.questionService.getNextId();
    return {
      success: true,
      data: { nextId },
      message: '获取下一个ID成功'
    };
  }

  @SkipAuth()
  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    let question;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      question = await this.questionService.findOne(id);
    } else {
      question = await this.questionService.findById(parseInt(id));
    }
    
    return {
      success: true,
      data: [question], // 改为数组格式
      count: 1,
      message: '获取问答信息成功'
    };
  }

  @SkipAuth()
  @Get('search/:keyword')
  async searchQuestions(@Param('keyword') keyword: string) {
    const questions = await this.questionService.searchByKeyword(keyword);
    
    return {
      success: true,
      data: questions,
      count: questions.length,
      message: '搜索问答成功'
    };
  }

  // 以下操作需要认证 - 与 product.controller.ts 保持一致
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    const question = await this.questionService.create(createQuestionDto);
    
    return {
      success: true,
      data: [question], // 改为数组格式
      count: 1,
      message: '问答创建成功'
    };
  }

  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    const question = await this.questionService.update(id, updateQuestionDto);
    
    return {
      success: true,
      data: [question], // 改为数组格式
      count: 1,
      message: '问答更新成功'
    };
  }

  // 修复：与 product.controller.ts 保持一致，返回 HttpStatus.OK
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteQuestion(@Param('id') id: string) {
    const result = await this.questionService.remove(id);
    
    return {
      success: true,
      message: result.message
    };
  }
}