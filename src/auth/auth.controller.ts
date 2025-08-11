import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  LoginUserDTO,
  OAuthDTO,
  UpdateUserDTO,
} from './dto/user.dto';
import { LoginGuard } from './security/auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from './security/payload.interface';
import { MoryService } from 'src/mory/mory.service';

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
    private moryService: MoryService,
  ) {}
  private readonly logger = new Logger('Auth');

  @Get('test')
  @UseGuards(LoginGuard)
  test(@Req() req: Request) {
    return req.user;
  }

  @Get('tt')
  @UseGuards(LoginGuard)
  async testt(@Req() req: Request) {
    return (await this.userService.getById((req.user as Payload).id)).diaries;
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO): Promise<TokenResponse> {
    if (!loginDto.email || !loginDto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    this.logger.log(`${loginDto.email} 로그인`);
    return await this.authService.vaildateUser(loginDto);
  }

  @Post('register')
  async register(@Body() createDto: CreateUserDTO) {
    this.logger.log(`${createDto.email} 회원가입`);
    return await this.authService.register(createDto);
  }

  @Delete('me')
  @UseGuards(LoginGuard)
  async deleteMe(@Req() req: Request) {
    // 인증 추가
    const payload = req.user as Payload;
    this.logger.log(`${payload?.email} 회원탈퇴`);
    return await this.authService.deleteByPayload(payload);
  }

  @Patch()
  @UseGuards(LoginGuard)
  async update(@Req() req: Request, @Body() updateDto: UpdateUserDTO) {
    return this.userService.update((req.user as Payload).id, updateDto);
  }

  //SECTION - OAuth 2.0
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    this.logger.log(`누군가 Google Redirect 요청`);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const appScheme = 'https://mory-backend-production.up.railway.app/public'; //mory://oauth
    const user = req.user as OAuthDTO;
    const existUser = await this.userService.findOne({ email: user.email });

    if (!existUser) {
      // Register flow
      const redirectUrl = `${appScheme}?status=register&email=${user.email}&name=${user.name}&provider=${user.provider}`;
      return res.redirect(redirectUrl);
    } else {
      // Login flow
      const tokenResponse = this.authService.vaildateOAuth(user, existUser);
      const redirectUrl = `${appScheme}?status=login&accessToken=${tokenResponse.accessToken}`;
      return res.redirect(redirectUrl);
    }
  }

  //SECTION - Mory
  @Get('mory')
  @UseGuards(LoginGuard)
  async updateMory(@Req() req: Request) {
    const user = await this.userService.findOne({
      id: (req.user as Payload).id,
    });
    return user?.mory;
  }
}
