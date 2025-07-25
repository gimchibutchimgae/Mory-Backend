import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDTO } from './dto/analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get(':id')
  find(@Param('id') id: number) {
    return this.analysisService.findOne({ id });
  }

  @Post()
  create(@Body() createDto: CreateAnalysisDTO) {
    // TODO: 사용자 인증하는 부분 구현하기
    return this.analysisService.create(createDto);
  }

  @Post('ai')
  async aiTest(@Body() diary: { content: string }) {
    if (diary.content.replaceAll(' ', '').length === 0) {
      throw new BadRequestException('일기에 내용을 기입해주세요.');
    }
    return await this.analysisService.analysisWithGPT(diary.content);
  }
}
