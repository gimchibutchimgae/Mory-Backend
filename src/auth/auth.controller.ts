import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user.dto';
import { LoginGuard } from './security/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('test')
  @UseGuards(LoginGuard)
  test(@Req() req: Request) {
    return req.user;
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
