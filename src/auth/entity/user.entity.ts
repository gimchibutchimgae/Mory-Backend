import { Diary } from 'src/diary/entity/diary.entity';
import { MonthlyAnalysis } from 'src/monthly_analysis/entity/monthly_analysis.entity';
import { Mory } from 'src/mory/entity/mory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'EF' })
  mbti: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToOne(() => Mory, (mory) => mory.user)
  @JoinColumn()
  mory: Mory;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @OneToMany(() => MonthlyAnalysis, (monthly) => monthly.user)
  monthlyAnalysis: MonthlyAnalysis[];
}
