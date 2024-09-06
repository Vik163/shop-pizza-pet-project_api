import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/accessToken.guard';

export function AccessToken() {
  return applyDecorators(UseGuards(AccessTokenGuard));
}
