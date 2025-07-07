import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from './entity/analysis.entity';
import { Repository } from 'typeorm';
import { CreateAnalysisDTO } from './dto/analysis.dto';
import { EMOTION_TYPE } from './entity/emotion.type';
import { DiaryService } from 'src/diary/diary.service';

const relations = ['diary'];

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis) private analysisRepo: Repository<Analysis>,
    private diaryService: DiaryService,
  ) {}

  async findOne(where: import('typeorm').FindOptionsWhere<Analysis>) {
    return await this.analysisRepo.findOne({ where, relations });
  }

  async find(where: import('typeorm').FindOptionsWhere<Analysis>) {
    return await this.analysisRepo.find({ where, relations });
  }

  // 이 함수는 ChatGPT API 호출 후에 받아오는 실행시킬 것으로 예상
  async create(createDto: CreateAnalysisDTO) {
    // Diary 검색
    const diary = await this.diaryService.findOne({ id: createDto.diaryId });
    if (!diary) throw new NotFoundException('해당 일기를 찾을 수 없습니다.');
    // ratio 정렬
    try {
      createDto.ratio = createDto.ratio.sort(([, v1], [, v2]) => v2 - v1);
      console.log('ratio ', createDto.ratio);
    } catch {
      // GPT 결과값이 원하는 형태로 반환되지 않을 경우 생기는 문제
      throw new InternalServerErrorException(
        '분석 결과를 불러오는 과정에서 문제가 발생하였습니다. 다시 시도해주세요.',
      );
    }
    const primary_emotion_type: EMOTION_TYPE = createDto.ratio[0][0];
    let analysis: Analysis;
    if (diary.analysis) {
      analysis = diary.analysis;
      analysis.emotions = createDto.emotions;
      analysis.ratio = createDto.ratio;
      analysis.primary_emotion_type = primary_emotion_type;
    } else {
      analysis = this.analysisRepo.create({
        ...createDto,
        primary_emotion_type,
        diary,
      });
    }
    diary.analysis = analysis;
    await this.diaryService.update(diary);
    return await this.analysisRepo.save(analysis);
  }
}
