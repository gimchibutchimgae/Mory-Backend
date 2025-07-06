import { Module } from '@nestjs/common';
import { MoryService } from './mory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mory } from './entity/mory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mory])],
  providers: [MoryService],
  exports: [TypeOrmModule, MoryService],
})
export class MoryModule {}
