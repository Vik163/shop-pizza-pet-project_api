import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

export function RefreshToken() {
  return applyDecorators(UseGuards(RefreshTokenGuard));
}
