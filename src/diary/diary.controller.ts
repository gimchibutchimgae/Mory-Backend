import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';
import { CreateDiaryDTO } from './dto/diary.dto';

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get()
  @UseGuards(LoginGuard)
  async findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    const diaries = await this.diaryService.findByUID(payload.id);
    return diaries;
  }

  // 중복 날짜 고려
  @Post()
  @UseGuards(LoginGuard)
  async write(@Req() req: Request, @Body() createDto: CreateDiaryDTO) {
    const payload = req.user as Payload;
    const diary = await this.diaryService.create(payload.id, createDto);
    return diary;
  }
}
