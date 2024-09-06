import { Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import session from 'express-session';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';

type TSess = session.Session & Partial<session.SessionData>;
interface ISession extends TSess {
  userId?: string;
  visits?: number;
  sessId?: string;
}

@Injectable()
export class SessionsService {
  private _user: UserDto;
  private _req: Request;
  private _res: Response;
  private _sess: ISession;
  private _yaProvider?: boolean;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  async handleSession(
    req: Request,
    res: Response,
    user: UserDto,
    yaProvider?: boolean,
  ) {
    this._user = user;
    this._req = req;
    this._res = res;
    this._sess = this._req.session;
    this._yaProvider = yaProvider;

    const authYaSessId = (await this.cacheManager.get('sessionId')) as string;
    if (authYaSessId) {
      this._req.sessionStore.get(
        authYaSessId,
        async (err, session: ISession) => {
          if (session) {
            this._setDataSession(session, authYaSessId);

            this._req.sessionStore.destroy(this._req.session.id, async () => {
              await this.cacheManager.del('sessionId');

              this._res.redirect(
                `https://pizzashop163.ru?user=${JSON.stringify(user)}`,
              );
            });
          } else {
            this._createSession();
          }
        },
      );
    } else {
      if (this._sess.userId) {
        this._updateSession();
      } else {
        this._createSession();
      }
    }
  }

  async _updateSession() {
    if (this._sess.userId === this._user.userId) {
      this._req.sessionStore.get(
        this._sess.id,
        async (err, session: ISession) => {
          if (session) {
            this._setDataSession(session, this._sess.id);
          }
        },
      );
    } else {
      console.log('all sessions');

      this._req.sessionStore.all((err, obg: ISession[]) => {
        const session = obg.find(
          (item: ISession) => item.userId === this._user.userId,
        );
        if (session) {
          this._setDataSession(session, session.id);

          session.save();
        } else {
          this._createSession();
        }
      });
    }
  }

  async _setDataSession(session: ISession, sessId: string) {
    // второй визит
    if (session.visits === 1) {
      this._user.userSettings.isFirstVisit = false;

      const data = await this.setSecondVisit();
      if (data) this._user = data;
    }
    session.userId = this._user.userId;
    session.sessId = sessId;
    session.visits = session.visits ? session.visits + 1 : 1;

    this._req.sessionStore.set(sessId, session, () => {});
  }

  async _createSession() {
    this._sess.userId = this._user.userId;
    this._sess.sessId = this._sess.id;
    this._sess.visits = 1;
    this._sess.save();

    this._yaProvider &&
      this._res.redirect(
        `https://pizzashop163.ru?user=${JSON.stringify(this._user)}`,
      );
  }

  setSecondVisit() {
    const newData = this.userService.updateUserData(
      this._user.userId,
      this._user,
    );

    if (newData) return newData;

    return null;
  }
}
