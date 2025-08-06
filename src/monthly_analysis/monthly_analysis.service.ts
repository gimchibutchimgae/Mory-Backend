import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthlyAnalysis } from './entity/monthly_analysis.entity';
import { Repository } from 'typeorm';
import { DiaryService } from 'src/diary/diary.service';
import { Diary } from 'src/diary/entity/diary.entity';
import { EMOTION_NUMBERS } from 'src/analysis/entity/emotion.type';
import { MonthluAnalysisDTO } from './dto/monthly_analysis.dto';

const relations = ['user'];

@Injectable()
export class MonthlyAnalysisService {
  constructor(
    @InjectRepository(MonthlyAnalysis)
    private monthlyRepo: Repository<MonthlyAnalysis>,
    private diaryService: DiaryService,
  ) {}

  //SECTION - Query
  async find(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.monthlyRepo.find({ where, relations });
  }

  async findOne(where: import('typeorm').FindOptionsWhere<Diary>) {
    return await this.monthlyRepo.findOne({ where, relations });
  }

  async save(dto: MonthluAnalysisDTO) {
    return await this.monthlyRepo.save(dto);
  }

  async update(id: number, dto: MonthluAnalysisDTO) {
    return await this.monthlyRepo.update(id, dto);
  }

  async getMonthlyData(
    userId: number,
    month: number,
  ): Promise<MonthluAnalysisDTO> {
    const diaries: Diary[] = await this.diaryService.find({
      user: { id: userId },
      month,
    });
    let emotionsCount: EMOTION_NUMBERS = this.initEmotionNumbers();
    let ratiosTotal: EMOTION_NUMBERS = this.initEmotionNumbers();
    if (diaries.length == 0) {
      throw new BadRequestException(
        `${month}월에 쓴 일기가 존재하지 않습니다.`,
      );
    }

    diaries.forEach((diary) => {
      const analysis = diary.analysis;
      //console.log(`${diary.day}일`);
      if (!analysis) return;
      ratiosTotal = this.addEmotionNumbers(ratiosTotal, analysis.ratio);
      const isExistEmotions: EMOTION_NUMBERS = {
        RED: Number(analysis.feel.RED.length > 0),
        GREEN: Number(analysis.feel.GREEN.length > 0),
        YELLOW: Number(analysis.feel.YELLOW.length > 0),
        BLUE: Number(analysis.feel.BLUE.length > 0),
      };
      emotionsCount = this.addEmotionNumbers(emotionsCount, isExistEmotions);
    });

    const diaryCount = diaries.length;
    const floor = (x: number) => Math.floor(100 * x) / 100;
    const ratiosMean: EMOTION_NUMBERS = {
      RED: floor(ratiosTotal.RED / diaryCount),
      GREEN: floor(ratiosTotal.GREEN / diaryCount),
      YELLOW: floor(ratiosTotal.YELLOW / diaryCount),
      BLUE: floor(ratiosTotal.BLUE / diaryCount),
    };

    // 저번 달과 차이 값 구하기
    const lastMonthly = await this.findOne({
      user: { id: userId },
      month: month == 12 ? 1 : month - 1,
    });
    let emotionsCountDelta: EMOTION_NUMBERS;
    if (lastMonthly?.emotions_count)
      emotionsCountDelta = this.subEmotionNumbers(
        emotionsCount,
        lastMonthly.emotions_count,
      );
    else emotionsCountDelta = emotionsCount;
    return {
      month,
      ratios: ratiosMean,
      emotions_count: emotionsCount,
      emotions_count_delta: emotionsCountDelta,
    };
  }

  //SECTION - Emotions operate
  addEmotionNumbers(a: EMOTION_NUMBERS, b: EMOTION_NUMBERS): EMOTION_NUMBERS {
    return {
      RED: a.RED + b.RED,
      YELLOW: a.YELLOW + b.YELLOW,
      BLUE: a.BLUE + b.BLUE,
      GREEN: a.GREEN + b.GREEN,
    };
  }

  subEmotionNumbers(a: EMOTION_NUMBERS, b: EMOTION_NUMBERS): EMOTION_NUMBERS {
    return {
      RED: a.RED - b.RED,
      YELLOW: a.YELLOW - b.YELLOW,
      BLUE: a.BLUE - b.BLUE,
      GREEN: a.GREEN - b.GREEN,
    };
  }

  initEmotionNumbers(): EMOTION_NUMBERS {
    return { RED: 0, GREEN: 0, YELLOW: 0, BLUE: 0 };
  }
}
