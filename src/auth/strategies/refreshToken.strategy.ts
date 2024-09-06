import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

// получаю токен из куки (bearer не добавляется)
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => req.cookies.refreshToken,
      secretOrKey: process.env.REFRESH_SECRET,
      // если указан JWT с истекшим сроком действия, запрос будет отклонен (401 Unauthorized)
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: UserDto) {
    const refreshToken = req.cookies.refreshToken;
    return { ...payload, refreshToken };
  }
}
