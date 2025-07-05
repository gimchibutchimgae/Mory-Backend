import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';

type ReturnEntity = User | null;
const relations = [];

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // With Relations
  async findOne(where: import('typeorm').FindOptionsWhere<User>) {
    return await this.userRepo.findOne({ where, relations });
  }

  async findByPayload(payload: Payload) {
    return await this.findOne({ id: payload.id });
  }

  async getById(id: number): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('해당 ID를 가진 유저를 찾지 못하였습니다.');
    }
    return user;
  }

  async create(createDto: CreateUserDTO): Promise<ReturnEntity> {
    await this.encryptPassword(createDto);
    return await this.userRepo.save(createDto);
  }

  async update(updateDto: UpdateUserDTO): Promise<ReturnEntity> {
    // pwd 업데이트 필요시 암호화
    return await this.userRepo.save(updateDto);
  }

  async encryptPassword(userDto: CreateUserDTO) {
    userDto.password = await this.encrypt(userDto.password);
  }

  async encrypt(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async comparePassword(password: string, user: User) {
    return await bcrypt.compare(password, user.password);
  }
}
