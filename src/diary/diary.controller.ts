import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';
import { CreateDiaryDTO, UpdateDiaryDTO } from './dto/diary.dto';
import { Role } from 'src/auth/entity/user.entity';

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get(':id')
  @UseGuards(LoginGuard)
  async find(@Req() req: Request, @Param('id') id: number) {
    const payload = req.user as Payload;
    const diary = await this.diaryService.findOne({ id });
    if (!diary) throw new NotFoundException('해당 일기가 존재하지 않습니다.');
    if (diary.user?.id !== payload.id && payload.role == Role.USER)
      throw new ForbiddenException('해당 일기의 소유자가 아닙니다.');
    return diary;
  }

  @Get()
  @UseGuards(LoginGuard)
  async findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    const diaries = await this.diaryService.findByUID(payload.id);
    return diaries;
  }

  @Post()
  @UseGuards(LoginGuard)
  async write(@Req() req: Request, @Body() createDto: CreateDiaryDTO) {
    const payload = req.user as Payload;
    const diary = await this.diaryService.create(payload.id, createDto);
    return diary;
  }

  @Patch(':id')
  @UseGuards(LoginGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateDto: UpdateDiaryDTO,
  ) {
    // 계정 인증
    const diary = await this.diaryService.findOne({ id });
    if (!diary) throw new NotFoundException('해당 일기가 존재하지 않습니다.');
    if (diary.user.id !== (req.user as Payload).id)
      throw new ForbiddenException('해당 일기에 대한 접근 권한이 없습니다.');
    return await this.diaryService.update(id, updateDto);
  }
}
