import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import session from 'express-session';
import { ObjectId } from 'mongoose';
import { RefreshTokenDto } from 'src/auth/dto/tokens.dto';

export enum Roles {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  DEVELOPER = 'DEVELOPER',
}

type TSess = session.Session & Partial<session.SessionData>;
export interface ISession extends TSess {
  userId?: string;
  visits?: number;
  provider?: string;
  pro?: string;
}

export interface Birthday {
  day: string;
  month: string;
  year: string;
}

export interface UserSettings {
  isFirstVisit: boolean;
  addAdvertisement: boolean;
  theme: string;
  viewLoadProducts: string;
}

export class UserDto {
  _id?: ObjectId;
  // Не обновлялся пользователь по личному id (конфликт дубликат ключа) пришлось добавить ObjectId
  userId?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  // @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @Matches(/(?:\+|\d)[\d\-\(\) ]{9,}\d/g, {
    message: 'неправильный формат телефона',
  })
  @IsOptional()
  phoneNumber?: string;
  birthday?: Birthday;
  userSettings?: UserSettings;

  // @IsNotEmpty()
  // @MinLength(8)
  // @MaxLength(20)
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
  //   message: 'password too weak',
  // })
  // password: string;
  @IsNotEmpty()
  @IsOptional() // @IsOptional() и @IsNotEmpty() указывает, что поле "name", если оно присутствует, не должно быть пустым
  @MinLength(2)
  @MaxLength(20)
  name?: string;

  // @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(20)
  // lastName: string;

  // @IsEnum(Roles, { each: true })
  role?: Roles;
  refreshTokenData?: RefreshTokenDto | null;
  createDate?: Date;
}

export class UserFirebaseDto {
  state: string;
}
