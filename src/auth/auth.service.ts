import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { Payload } from './security/payload.interface';
import { CreateUserDTO, LoginUserDTO, OAuthDTO } from './dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { MoryService } from 'src/mory/mory.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private moryService: MoryService,
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

  async register(createDto: CreateUserDTO) {
    const existUser = await this.userService.findOne({
      email: createDto.email,
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일 입니다.');
    // 계정 생성
    const user = await this.userService.create(createDto);
    if (!user)
      throw new InternalServerErrorException(
        '계정을 생성하는 과정에서 알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
      );
    // User Entity 의존성 관련
    const mory = await this.moryService.create(user);
    await this.userService.init(user, { mory });
    return user;
  }

  async deleteByPayload(payload: Payload) {
    return await this.userService.delete(payload.id);
  }

  //SECTION - vaildate
  async vaildateUser(loginDto: LoginUserDTO) {
    const user = await this.userService.findOne({ email: loginDto.email });
    // 이메일 존재 X
    if (!user)
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 옳바르지 않습니다.',
      );
    // 비밀번호 매칭 X
    const isCorrectPassword = await this.userService.comparePassword(
      loginDto.password,
      user,
    );
    if (!isCorrectPassword)
      throw new UnauthorizedException(
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

  vaildateOAuth(oauthDto: OAuthDTO, user: User) {
    if (user.provider !== oauthDto.provider) {
      throw new BadRequestException('인증 서비스가 옳바르지 않습니다.');
    }
    // JWT 발급
    const payload = this.userToPayload(user);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
