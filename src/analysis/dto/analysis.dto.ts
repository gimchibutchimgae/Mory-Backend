import { EMOTION_NUMBERS, EMOTION_CLUES } from '../entity/emotion.type';

export interface CreateAnalysisDTO {
  feel: EMOTION_CLUES;
  ratio: EMOTION_NUMBERS;
}
