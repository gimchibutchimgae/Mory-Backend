/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from './payload.interface';
import { Request } from 'express';
import { Role } from '../entity/user.entity';

@Injectable()
export class LoginGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('로그인이 필요한 기능입니다.');
    }
    return user;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user as Payload;

    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    return true;
  }
}
