import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './entity/diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDTO, UpdateDiaryDTO } from './dto/diary.dto';
import { UserService } from 'src/auth/user.service';

const relations = ['user', 'analysis'];

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private diaryRepo: Repository<Diary>,
    private userService: UserService,
  ) {}
  private readonly logger = new Logger('TTEST');

  async find(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.diaryRepo.find({ where, relations });
  }

  async findOne(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.diaryRepo.findOne({ where, relations });
  }

  async findByUID(userId: number) {
    return await this.find({ user: { id: userId } });
  }

  async summary(userId: number, month: number) {
    const result = {};
    for (let i = 0; i < 31; i++) {
      result[`${i + 1}`] = null;
    }
    const records = await this.find({ month, user: { id: userId } });
    records.forEach((record) => {
      const value = record.analysis?.primary_emotion_type;
      if (value) {
        result[`${record.day}`] = value;
      } else {
        result[`${record.day}`] = 'YET';
      }
    });
  }

  async create(userId: number, createDto: CreateDiaryDTO) {
    const user = await this.userService.findOne({ id: userId });
    this.logger.warn(userId);
    if (!user)
      throw new UnauthorizedException(
        '계정이 유효하지 않습니다. 다시 로그인하여 주세요.',
      );

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const existDiary = await this.findOne({
      month,
      day,
      user: { id: user.id },
    });
    let diary: Diary;

    this.logger.log(existDiary);
    if (existDiary) {
      this.logger.log('entry 1');
      // 같은 날 작성한 일기 존재시 업데이트
      diary = existDiary;
      this.logger.log(diary);
      await this.diaryRepo.update(existDiary.id, createDto);
    } else {
      this.logger.log('entry 2');
      diary = this.diaryRepo.create({
        user,
        month,
        day,
        ...createDto,
      });
      this.logger.log(diary);
      await this.diaryRepo.save(diary);
      await this.userService.appendDiary(user, diary);
    }
    // TODO: 일기 쓸때마다 성장 관련 처리
    return diary;
  }

  async save(diary: Diary) {
    return await this.diaryRepo.save(diary);
  }

  async update(id: number, updateDto: UpdateDiaryDTO) {
    return await this.diaryRepo.update(id, updateDto);
  }
}
