import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mory } from './entity/mory.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UpdateMoryDTO } from './dto/mory.dto';

@Injectable()
export class MoryService {
  constructor(@InjectRepository(Mory) private moryRepo: Repository<Mory>) {}

  async create(user: User) {
    const mory = this.moryRepo.create({ user });
    // 초기 설정
    return await this.moryRepo.save(mory);
  }

  async update(id: number, updateDto: UpdateMoryDTO) {
    return await this.moryRepo.update(id, updateDto);
  }
}
