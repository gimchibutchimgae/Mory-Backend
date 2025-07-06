import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDTO, InitUserDTO, UpdateUserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';

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

  async create(createDto: CreateUserDTO): Promise<User> {
    await this.encryptPassword(createDto);
    return await this.userRepo.save(createDto);
  }

  async init(user: User, initDto: InitUserDTO) {
    user.mory = initDto.mory;
    return await this.userRepo.save(user);
  }

  async update(updateDto: UpdateUserDTO): Promise<User> {
    // pwd 업데이트 필요시 암호화
    return await this.userRepo.save(updateDto);
  }

  async delete(id: number) {
    return await this.userRepo.delete(id);
  }

  //SECTION - crpyto
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
