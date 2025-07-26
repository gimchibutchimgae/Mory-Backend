import { EMOTION_RATIO, EMOTION_CLUES } from '../entity/emotion.type';

export interface CreateAnalysisDTO {
  feel: EMOTION_CLUES;
  ratio: EMOTION_RATIO;
}
