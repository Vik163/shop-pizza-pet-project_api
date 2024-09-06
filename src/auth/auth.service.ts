import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users as UsersEntity } from 'src/user/enities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly sesionsService: SessionsService,
    private readonly tokensService: TokensService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // отбирает данные пользователя для клиента ===================
  private selectDataUsers(user: UserDto) {
    return {
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      birthday: user.birthday,
      name: user.name,
      email: user.email,
      userSettings: user.userSettings,
    };
  }

  // получаем пользователя по id или возвращаем "не найден"
  // получаем время хранения =====================================================
  async getInitialUserById(
    id: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    const user: UserDto = await this.userRepository.findOne({
      where: { userId: id },
    });

    if (user) {
      const tokens = await this.tokensService.getTokens(
        user.userId,
        user.phoneNumber,
      );

      const timeToken = this.tokensService.handleTimeToken(
        user.refreshTokenData.createToken,
      );

      // время вышло или нет рефреш => обновляем токен в БД и отправляем токены в куки
      if (
        timeToken > process.env.TIME_REFRESH - 2 ||
        !req.cookies.refreshToken
      ) {
        await this.tokensService.updateRefreshToken(user, tokens.refreshToken);
        this.tokensService.sendTokens(res, tokens);
      } else {
        // время не вышло отправляю в куки accessToken
        res.cookie('accessToken', tokens.accessToken, { secure: true });
      }

      // отбираю нужные данные пользователя для клиента, создаю сессию и отправляю на фронт
      const selectedUserData: UserDto = this.selectDataUsers(user);
      this.sesionsService.handleSession(req, res, selectedUserData);

      res.send(selectedUserData);
    } else {
      // throw new UnauthorizedException('Пользователь не найден');
      res.send({ message: 'Пользователь не найден' });
    }
  }

  // Определить пользователя
  // Ищем в БД, если нет создаем
  // устанавливаем токены и сессию ===========================================
  async handleUser(
    userRequest: UserDto,
    req: Request,
    res: Response,
    yaProvider?: boolean,
  ): Promise<AuthDto> {
    let userData: AuthDto;

    // проверяем существующего пользователя по телефону в БД
    let user: UserDto = await this.userRepository.findOne({
      where: {
        phoneNumber: userRequest.phoneNumber,
      },
    });

    // Если пользователь есть, генерируем токены, обновляем в БД токен
    if (user) {
      const tokens = await this.tokensService.getTokens(
        user.userId,
        user.phoneNumber,
      );
      await this.tokensService.updateRefreshToken(user, tokens.refreshToken);

      // отбираю нужные данные пользователя для клиента и создаю сессию отправляю на фронт
      const selectedUserData: UserDto = this.selectDataUsers(user);
      user = selectedUserData;
      userData = { user, tokens };

      this.sesionsService.handleSession(req, res, selectedUserData, yaProvider);

      // Если пользователя нет создаем все
    } else {
      const newUserData: AuthDto = await this.createUser(userRequest);

      if (newUserData.user) {
        // отбираю нужные данные пользователя для клиента и создаю сессию отправляю на фронт
        const selectedUserData: UserDto = this.selectDataUsers(
          newUserData.user,
        );
        newUserData.user = selectedUserData;
        userData = newUserData;

        this.sesionsService.handleSession(
          req,
          res,
          selectedUserData,
          yaProvider,
        );
      }
    }

    // Возвращаем токены и пользователя
    return userData;
  }

  // Создание пользователя =====================================================
  private async createUser(user: UserDto): Promise<AuthDto> {
    const userSettings = {
      isFirstVisit: true,
      addAdvertisement: false,
      theme: 'app_light_theme',
      viewLoadProducts: 'pages',
    };
    // Добавляем в БД доп. инфо
    user.userId = uuidv4();
    user.createDate = new Date();
    user.userSettings = userSettings;

    // генерирую токены
    const tokens = await this.tokensService.getTokens(
      user.userId,
      user.phoneNumber,
    );

    // хешируем refresh и создаем user.refreshTokenData для БД
    const hashedRefreshToken = await this.tokensService.hashData(
      tokens.refreshToken,
    );
    user.refreshTokenData = {
      refreshToken: hashedRefreshToken,
      createToken: new Date(),
    };

    const newUser = this.userRepository.create(user);

    const userDto: UserDto = await this.userRepository.save(newUser);

    return { user: userDto, tokens };
  }

  // Выход ===================================================================
  async signout(res: Response) {
    res.clearCookie('__Host-psifi.x-csrf-token');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    // res.clearCookie('sessPizza');
    res.send({ status: 'success' });
  }
}
