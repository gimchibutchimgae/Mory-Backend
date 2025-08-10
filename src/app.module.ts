import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { MoryModule } from './mory/mory.module';
import { Mory } from './mory/entity/mory.entity';
import { DiaryModule } from './diary/diary.module';
import { Diary } from './diary/entity/diary.entity';
import { AnalysisModule } from './analysis/analysis.module';
import { Analysis } from './analysis/entity/analysis.entity';
import { MonthlyAnalysisModule } from './monthly_analysis/monthly_analysis.module';
import { MonthlyAnalysis } from './monthly_analysis/entity/monthly_analysis.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Mory, Diary, Analysis, MonthlyAnalysis],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public', // http://localhost:3000/public/~~ 경로로 제공
    }),
    AuthModule,
    MoryModule,
    DiaryModule,
    AnalysisModule,
    MonthlyAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
