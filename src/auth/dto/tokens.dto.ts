export class TokensDto {
  accessToken: string;
  refreshToken?: string;
}

export class RefreshTokenDto {
  createToken: Date;
  refreshToken: string | null;
}
