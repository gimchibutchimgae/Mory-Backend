/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, Max, Min } from 'class-validator';
import { Analysis } from 'src/analysis/entity/analysis.entity';
import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @IsInt()
  @Min(1970)
  @Max(2099)
  @Column({ default: 2025 })
  year: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @Column({ default: 1 })
  month: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @Column({ default: 1 })
  day: number;

  @ManyToOne(() => User, (user) => user.diaries)
  user: User;

  @OneToOne(() => Analysis, (analysis) => analysis.diary, { nullable: true })
  analysis: Analysis;
}
