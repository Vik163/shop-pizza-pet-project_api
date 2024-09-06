import { UserDto } from 'src/user/dto/user.dto';
import { TokensDto } from './tokens.dto';

export class AuthDto {
  user: UserDto;
  tokens: TokensDto;
}

export class YandexTokensDto {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'bearer';
}

export class YandexUserInfoDto {
  id: string;
  login: string;
  client_id: string;
  default_email: string;
  emails: string[];
  default_phone: { id: number; number: string };
  psuid: string;
}
