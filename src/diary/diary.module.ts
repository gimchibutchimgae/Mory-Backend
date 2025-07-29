import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entity/diary.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MoryModule } from 'src/mory/mory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), AuthModule, MoryModule],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
