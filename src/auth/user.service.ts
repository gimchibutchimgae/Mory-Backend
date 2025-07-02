import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';

type ReturnEntity = User | null;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getById(id: number): Promise<ReturnEntity> {
    return await this.userRepo.findOneBy({ id });
  }

  async create(createDto: CreateUserDTO): Promise<ReturnEntity> {
    return await this.userRepo.save(createDto);
  }

  async update(updateDto: UpdateUserDTO): Promise<ReturnEntity> {
    return await this.userRepo.save(updateDto);
  }
}
