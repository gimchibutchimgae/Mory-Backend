import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('test')
  async test() {
    await this.userService.create({
      name: 'guest',
      email: 'guest',
      password: 'guest',
    });
    return;
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO) {
    if (!loginDto.email || !loginDto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    return await this.authService.vaildateUser(loginDto);
  }
}
