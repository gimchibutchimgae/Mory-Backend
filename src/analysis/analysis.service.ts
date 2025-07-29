import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from './entity/analysis.entity';
import { Repository } from 'typeorm';
import { CreateAnalysisDTO } from './dto/analysis.dto';
import { EMOTION_TYPE } from './entity/emotion.type';
import { DiaryService } from 'src/diary/diary.service';
import OpenAI from 'openai';
import { getPromptByDiary } from './gpt/prompt';
import { Diary } from 'src/diary/entity/diary.entity';

const API_PARSE_ERROR =
  '분석 결과를 불러오는 과정에서 문제가 발생하였습니다. 다시 시도해주세요.';

const relations = ['diary', 'diary.user'];

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis) private analysisRepo: Repository<Analysis>,
    private diaryService: DiaryService,
  ) {}
  private logger = new Logger('Analysis');

  async findOne(where: import('typeorm').FindOptionsWhere<Analysis>) {
    return await this.analysisRepo.findOne({ where, relations });
  }

  async find(where: import('typeorm').FindOptionsWhere<Analysis>) {
    return await this.analysisRepo.find({ where, relations });
  }

  // Analysis -> Save
  async analysisDiary(userId: number, diaryId: number) {
    // Diary 검색
    const diary = await this.diaryService.findOne({ id: diaryId });
    if (!diary) throw new NotFoundException('해당 일기를 찾을 수 없습니다.');
    if (diary.user.id !== userId)
      throw new ForbiddenException('해당 일기에 대한 접근 권한이 없습니다.');
    if (diary.content.replaceAll(' ', '').length === 0)
      throw new BadRequestException('일기에 내용을 기입해주세요.');
    this.logger.log('분석: 값 오류 없음');
    const result = await this.analysisWithGPT(diary.content);
    //const result = GPT_RESULT_EXAMPLE;
    const analysis = await this.create(diary, result);
    return analysis;
  }

  async analysisWithGPT(content: string): Promise<CreateAnalysisDTO> {
    const openai = new OpenAI({
      apiKey: process.env.GPT_API_KEY,
    });

    this.logger.log('분석: GPT API response');
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: getPromptByDiary(content),
      store: true,
    });
    this.logger.log('분석: GPT API request');
    this.logger.debug(response.output_text);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result: CreateAnalysisDTO = JSON.parse(response.output_text);
      this.logger.log('분석: 결과값 JSON으로 파싱');
      if (!result.feel || !result.ratio)
        throw new InternalServerErrorException(API_PARSE_ERROR);
      return result;
    } catch {
      throw new InternalServerErrorException(API_PARSE_ERROR);
    }
  }

  // 이 함수는 ChatGPT API 호출 후에 받아오는 실행시킬 것으로 예상
  async create(diary: Diary, createDto: CreateAnalysisDTO) {
    // ratio 정렬
    let primary_emotion_type: EMOTION_TYPE;
    try {
      const sortedEntries = Object.entries(createDto.ratio).sort(
        ([, v1], [, v2]) => v2 - v1,
      );
      primary_emotion_type = sortedEntries[0][0] as EMOTION_TYPE;
    } catch {
      // GPT 결과값이 원하는 형태로 반환되지 않을 경우 생기는 문제
      throw new InternalServerErrorException(API_PARSE_ERROR);
    }
    let analysis: Analysis;
    if (diary.analysis) {
      analysis = diary.analysis;
      analysis.feel = createDto.feel;
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
    await this.diaryService.save(diary);
    return await this.analysisRepo.save(analysis);
  }
}
