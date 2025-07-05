import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO, OAuthDTO } from './dto/user.dto';
import { LoginGuard } from './security/auth.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface TokenResponse {
  accessToken: string;
}

interface OAuthReturn {
  status: 'login' | 'register';
  value: Express.User | TokenResponse;
}

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
  async login(@Body() loginDto: LoginUserDTO): Promise<TokenResponse> {
    if (!loginDto.email || !loginDto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    return await this.authService.vaildateUser(loginDto);
  }

  @Post('register')
  async register(@Body() createDto: CreateUserDTO) {
    return await this.authService.register(createDto);
  }

  //SECTION - OAuth 2.0
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: Request): Promise<OAuthReturn> {
    /* 
      login : { status: 'login', value: JWT-String }
      register : { status: 'register', value: OAuthDTO }
    */
    const user = req.user as OAuthDTO;
    const existUser = await this.userService.findOne({ email: user.email });
    if (!existUser) {
      return {
        status: 'register',
        value: user,
      };
    }
    const tokenResponse = this.authService.vaildateOAuth(user, existUser);
    return {
      status: 'login',
      value: tokenResponse,
    };
  }
}
