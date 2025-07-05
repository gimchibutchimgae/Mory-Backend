/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { OAuthDTO } from '../dto/user.dto';
import { Provider } from '../entity/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) {
    const { emails, displayName } = profile;
    if (!emails) {
      throw new UnauthorizedException('이메일 정보를 가져올 수 없습니다.');
    }
    const user: OAuthDTO = {
      email: emails[0].value,
      name: displayName,
      provider: Provider.GOOGLE,
    };

    done(null, user); // 인증 성공
  }
}
