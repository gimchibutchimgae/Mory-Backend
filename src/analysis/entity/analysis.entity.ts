import { Diary } from 'src/diary/entity/diary.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EMOTION_NUMBERS, EMOTION_TYPE, EMOTION_CLUES } from './emotion.type';

@Entity()
export class Analysis {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Diary, (diary) => diary.analysis)
  @JoinColumn()
  diary: Diary;

  @Column({ default: 'RED' })
  primary_emotion_type: EMOTION_TYPE;

  @Column('simple-json')
  feel: EMOTION_CLUES;

  // MySQL : 'simple-json' | PostgreSQL : 'json'
  @Column('simple-json')
  ratio: EMOTION_NUMBERS;
}
