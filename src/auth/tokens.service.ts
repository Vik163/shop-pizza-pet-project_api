import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';
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

  // Хеширование refresh для БД (если будет пароль, то тоже)
  hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  // Счетчик времени хранения токена в БД (сколько дней уже храниться) =================
  handleTimeToken(date: Date): number {
    //Get 1 day in milliseconds
    const one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    const date1_ms = date.getTime();
    const date2_ms = new Date().getTime();

    const difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
  }

  // Получаю токены: из куки запроса и хешированный из БД
  // верифицуруются argon2
  // Проверяю время токена в БД и если вышло то возвращаю новые токены иначе только access
  async updateTokens(
    userId: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const refreshToken: string = req.cookies.refreshToken;

    const user: UserDto = await this.userService.findById(userId);
    // хешированный из БД
    const token = user.refreshTokenData.refreshToken;
    if (!user || !token)
      throw new ForbiddenException(
        'Доступ отклонён (обновление refresh tokenservise)',
      );
    // верификация
    const refreshTokenMatches = await argon2.verify(token, refreshToken);
    if (!refreshTokenMatches)
      throw new ForbiddenException(
        'Доступ отклонён (проверка refresh tokenservise)',
      );
    const tokens = await this.getTokens(user.userId, user.phoneNumber);

    const timeToken = this.handleTimeToken(user.refreshTokenData.createToken);
    console.log('timeToken:', timeToken);
    // время вышло => обновляем токен в БД и отправляем токены в куки
    if (timeToken < this._timeRefresh) {
      await this.updateRefreshToken(user, tokens.refreshToken);
      this.sendTokens(res, tokens);
      return true;
    } else {
      return false;
    }
  }

  async updateRefreshToken(user: UserDto, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    user.refreshTokenData = {
      refreshToken: hashedRefreshToken,
      createToken: new Date(),
    };

    await this.userService.updateUserData(user.userId, user);
  }

  async getTokens(userId: string, phoneNumber: string): Promise<TokensDto> {
    const payload = { userId, phoneNumber };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('access_secret') ||
          'this is a secret ACCESS_SECRET',
        expiresIn: '30s',
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
        maxAge: 60 * 60 * 24 * 1000 * this._timeRefresh,
      });
  }

  setCsrfToken(req: Request) {
    const csrf = req.csrfToken(true);
    return csrf;
  }

  // Выход ===================================================================
  async deleteTokens(res: Response) {
    res.clearCookie('__Host-psifi.x-csrf-token');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('sessPizza');
    res.send({ status: 'delete' });
  }
}
