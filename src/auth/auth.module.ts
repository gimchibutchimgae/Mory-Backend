import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './security/jwt.strategy';
import { GoogleStrategy } from './security/google.startegy';
import { MoryModule } from 'src/mory/mory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTKEY, // dotenv로 분리 가능
      signOptions: { expiresIn: '4h' },
    }),
    MoryModule,
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
