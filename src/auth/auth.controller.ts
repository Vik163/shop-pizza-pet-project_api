import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthProvidersService } from './authProviders.service';
import { RefreshToken } from 'src/common/decorators/refreshToken.decorator';
import { TokensService } from './tokens.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authProvidersService: AuthProvidersService,
    private readonly tokensService: TokensService,
  ) {}

  // Первый запрос на определение пользователя ============
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
  ): Promise<void> {
    await this.authService.signout(res);
  }

  @Get('csrf')
  async csrf(@Req() req: Request): Promise<string> {
    const csrf = req.csrfToken(true);
    return csrf;
  }

  // Запрос на обновление токенов ===========================
  // защитник @RefreshToken
  @RefreshToken()
  @Get('refresh/:id')
  async updateTokens(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    await this.tokensService.updateTokens(id, req, res);
    res.end('Токены');
  }
}
