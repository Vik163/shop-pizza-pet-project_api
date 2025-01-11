import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class TokensService {
  private _timeRefresh: number;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this._timeRefresh = this.configService.get<number>('time_refresh');
  }

  // Получаю токены: из куки запроса и  БД
  // Сверяю и возвращаю access
  async updateAccessTokenByRefresh(
    userId: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const refreshCookie: string = req.cookies.refreshToken;

    const user: UserDto = await this.userService.findById(userId);

    if (user) {
      // из БД
      const refreshDb = user.refreshTokenData.refreshToken;
      // верификация
      if (refreshDb === refreshCookie) {
        const tokens = await this.getTokens(user.userId);
        this.sendAccessToken(res, tokens);
        return true;
      }
      this.deleteTokens(res);
      return false;
    }
    this.deleteTokens(res);
    return false;
  }

  async updateRefreshToken(user: UserDto, refreshToken: string): Promise<void> {
    user.refreshTokenData = {
      refreshToken: refreshToken,
      createToken: new Date(),
    };

    await this.userService.updateUserData(user.userId, user);
  }

  async getTokens(userId: string): Promise<TokensDto> {
    const payload = { userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('access_secret') ||
          'this is a secret ACCESS_SECRET',
        expiresIn: this.configService.get<string>('time_access'),
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('refresh_secret') ||
          'this is a secret REFRESH_SECRET',
        expiresIn: `${this._timeRefresh}d`,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Отправка токенов ========================================================
  async sendTokens(res: Response, tokens: TokensDto): Promise<void> {
    res.cookie('accessToken', tokens.accessToken, { secure: true });
    tokens.refreshToken &&
      res.cookie('refreshToken', tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1000 * this._timeRefresh,
      });
  }

  async sendAccessToken(res: Response, tokens: TokensDto): Promise<void> {
    res.cookie('accessToken', tokens.accessToken, { secure: true });
  }

  // setCsrfToken(req: Request) {
  //   const csrf = req.csrfToken(true);
  //   return csrf;
  // }

  // Выход ===================================================================
  async deleteTokens(res: Response) {
    res.clearCookie('__Host-psifi.x-csrf-token');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('sessPizza');
    res.end();
  }
}
