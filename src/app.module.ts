import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { MoryModule } from './mory/mory.module';
import { Mory } from './mory/entity/mory.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Mory],
      synchronize: true,
    }),
    AuthModule,
    MoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
