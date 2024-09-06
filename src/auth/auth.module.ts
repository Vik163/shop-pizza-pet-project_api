import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'firebaseconfig/firebase.setup';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { SessionsService } from './sessions.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UserService } from 'src/user/user.service';
import { AuthProvidersService } from './authProviders.service';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users as UsersEntity } from 'src/user/enities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    PassportModule.register({
      session: true,
    }),
    // объект пустой, так как ключ не один
    JwtModule.register({}),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthProvidersService,
    FirebaseAdmin,
    SessionsService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UserService,
    TokensService,
  ],
})
export class AuthModule {}
