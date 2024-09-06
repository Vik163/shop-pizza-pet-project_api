import {
  // ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { ExtractJwt } from 'passport-jwt';
// import { TokensService } from 'src/auth/token.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  //* можно использовать нужную логику для проверки
  // constructor(
  //   // private readonly authService: AuthService,
  //   private readonly tokenService: TokensService,
  // ) {
  //   super();
  // }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();

  //   try {
  //     const refreshToken = request.cookies.refreshToken;
  //     console.log('refreshTokenGuard:', refreshToken);
  //     if (!refreshToken)
  //       throw new UnauthorizedException('Refresh token is not set');
  //     // const isValidRefreshToken = this.authService.validateToken(refreshToken);
  //     // if (!isValidRefreshToken)
  //     //   throw new UnauthorizedException('Refresh token is not valid');

  //     // return this.activate(context);
  //   } catch (err) {
  //     console.log('err:', err);

  //     return false;
  //   }
  // }

  // async activate(context: ExecutionContext): Promise<boolean> {
  //   return super.canActivate(context) as Promise<boolean>;
  // }
  handleRequest(err: any, user: any) {
    if (err || !user) {
      console.log('RefreshTokenGuard', err);

      throw err || new UnauthorizedException();
    }
    return user;
  }
}
