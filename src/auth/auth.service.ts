import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { Payload } from './security/payload.interface';
import { LoginUserDTO } from './dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  userToPayload(user: User): Payload {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async vaildateUser(loginDto: LoginUserDTO) {
    const user = await this.userService.findOne({ email: loginDto.email });
    // 이메일 존재 X
    console.log(loginDto);
    console.log(user);
    if (!user)
      throw new BadRequestException(
        '이메일 또는 비밀번호가 옳바르지 않습니다.',
      );
    // 비밀번호 매칭 X
    const isCorrectPassword = await this.userService.comparePassword(
      loginDto.password,
      user,
    );
    if (!isCorrectPassword)
      throw new BadRequestException(
        '이메일 또는 비밀번호가 옳바르지 않습니다.',
      );
    // JWT 발급
    const payload = this.userToPayload(user);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  vaildateToken(jwtString: string): Payload | false {
    try {
      const payload = jwt.verify(jwtString, process.env.JWTKEY as string);
      return payload as Payload;
    } catch {
      return false;
    }
  }
}
