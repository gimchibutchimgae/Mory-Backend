import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
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
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from './security/payload.interface';
import { MoryService } from 'src/mory/mory.service';
import { UpdateMoryDTO } from 'src/mory/dto/mory.dto';

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

  @Post('test')
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
    return await this.authService.vaildateUser(loginDto);
  }

  @Post('register')
  async register(@Body() createDto: CreateUserDTO) {
    return await this.authService.register(createDto);
  }

  @Delete('me')
  @UseGuards(LoginGuard)
  async deleteMe(@Req() req: Request) {
    // 인증 추가
    return await this.authService.deleteByPayload(req.user as Payload);
  }

  @Patch()
  @UseGuards(LoginGuard)
  async update(@Req() req: Request, @Body() updateDto: UpdateUserDTO) {
    return this.userService.update((req.user as Payload).id, updateDto);
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

  //SECTION - Mory
  @Patch('mory')
  @UseGuards(LoginGuard)
  async updateMory(@Req() req: Request, @Body() updateDto: UpdateMoryDTO) {
    return this.moryService.update((req.user as Payload).id, updateDto);
  }
}
