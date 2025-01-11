import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  Res,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';
// import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthProvidersService } from './authProviders.service';
import { TokensService } from './tokens.service';
import { SessionsService } from './sessions.service';
import { AuthService } from './auth.service';
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authProvidersService: AuthProvidersService,
    private readonly tokensService: TokensService,
    private readonly sessionsService: SessionsService,
  ) {}

  // Первый запрос на определение пользователя ============
  @AccessToken()
  @Get('auth/:id')
  async getInitialUserById(
    @Param('id') id: string,
    @Req() req: Request,
    // если res, то отправка через res.send(), иначе не возвращает значение
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.getInitialUserById(id, req, res);
  }

  // авторизация через Яндекс ===============================
  @Get('yandex')
  async authUserByYandex(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    await this.authProvidersService.authUserByYandex(req, res);
  }

  // авторизация через firebase ===============================
  @Post('firebase')
  async authUserByFirebase(
    @Body(ValidationPipe) userRequest: UserDto,
    @Req() req: Request,
    // если res, то отправка через res.send(), иначе не возвращает значение
    @Res() res: Response,
  ): Promise<void> {
    await this.authProvidersService.authUserByFirebase(userRequest, req, res);
  }

  @Get('signout')
  async signout(
    // если res, то отправка через res.send(), иначе не возвращает значение
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    await this.tokensService.deleteTokens(res);
    await this.sessionsService.removeSession(req);
  }

  @Get('csrf')
  async csrf(@Req() req: Request): Promise<string> {
    const csrf = req.csrfToken(true);
    console.log('csrf:', csrf);
    return csrf;
  }

  // Запрос на обновление токенов ===========================
  // защитник @RefreshToken
  // @RefreshToken()
  @Get('refresh/:id')
  async updateTokens(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<{ message: string } | void> {
    const result = await this.tokensService.updateAccessTokenByRefresh(
      id,
      req,
      res,
    );
    if (!result) {
      await this.sessionsService.removeSession(req);
      throw new UnauthorizedException();
    }

    res.status(200).end('access обновлен');
    return { message: 'access обновлен' };
  }
}
