import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

export function Auth(...permissions: string[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(RefreshTokenGuard),
  );
}
