import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './entity/diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDTO } from './dto/diary.dto';
import { UserService } from 'src/auth/user.service';

const relations = [];

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private diaryRepo: Repository<Diary>,
    private userService: UserService,
  ) {}

  async find(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.diaryRepo.find({ where, relations });
  }

  async findOne(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.diaryRepo.findOne({ where, relations });
  }

  async findByUID(userId: number) {
    return await this.find({ user: { id: userId } });
  }

  async create(userId: number, createDto: CreateDiaryDTO) {
    const user = await this.userService.findOne({ id: userId });
    if (!user)
      throw new UnauthorizedException(
        '계정이 유효하지 않습니다. 다시 로그인하여 주세요.',
      );

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const diary = this.diaryRepo.create({
      user,
      month,
      day,
      ...createDto,
    });
    await this.diaryRepo.save(diary);
    await this.userService.appendDiary(user, diary);
    return diary;
  }
}
