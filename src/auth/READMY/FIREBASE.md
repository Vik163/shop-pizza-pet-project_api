### Авторизация firebase by phone и с помощью accessToken и refreshToken

#### Firebase

1. Устанавливаем _firebase-admin_, _cookie-parser_, _@types/cookie-parser_
2. Регистрируем [_Firebase Admin SDK_](https://firebase.google.com/docs/admin/setup?hl=ru)
3. в .env переносим config аккаунта строкой

   ```javascript
   FIREBASE_SERVICE_ACCOUNT_KEY = `{
   ...
   настройки
   ...
   }`;
   ```

4. создаем папку firebaseConfig с файлом firebase.setup.ts и используем там где нужно
   [https://www.trpkovski.com/2022/10/07/nestjs-authorisation-with-firebase-auth](https://www.trpkovski.com/2022/10/07/nestjs-authorisation-with-firebase-auth)

   ```javascript
   import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
   import * as admin from 'firebase-admin';

   let app: admin.app.App = null;

   @Injectable()
   export class FirebaseAdmin implements OnApplicationBootstrap {
     async onApplicationBootstrap() {
       if (!app) {
         const serviceAccount = JSON.parse(
           process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
         );

         app = admin.initializeApp({
           credential: admin.credential.cert(serviceAccount),
         });
       }
     }
     setup() {
       return app;
     }
   }
   ```

5. Пробовал [сессионные куки](https://firebase.google.com/docs/auth/admin/manage-cookies)
   получаю accessToken (firebase) из клиента для создания сессионного токена

6. Для создания сессионного токена нужен csrf токен

   - Устанавливаю _csurf_ , _@types/csurf_, _express-session_, _@types/express-session_
   - в main.ts в такой последовательности используются мидлевары
   - (sessionToken - имя сессионного токена, по которому его получать)

   ```javascript
   import * as cookieParser from 'cookie-parser';
   import * as session from 'express-session';
   import * as csurf from 'csurf';

   app.use(cookieParser());

   app.use(
     session({
       name: 'sessionToken',
       secret: 'this is a secret msg',
       resave: false,
       saveUninitialized: false,
       cookie: {},
     }),
   );

   app.use(csurf());
   ```

7. В защитнике получаю сессионый токен и верифицирую

   ```javascript
   @Injectable()
   export class AuthGuard implements CanActivate {
     constructor(
       private reflector: Reflector,
       private readonly admin: FirebaseAdmin,
     ) {}

     async canActivate(context: ExecutionContext): Promise<boolean> {
       const app = this.admin.setup();
       const req = context.switchToHttp().getRequest();
       try {
         // sessionToken - имя токена
         const sessionCookie = req.cookies.sessionToken || '';
         const claims = await app.auth().verifySessionCookie(sessionCookie, true);
         if (claims) return true;
       } catch (error) {
         console.log('Error', error);
         throw new UnauthorizedException();
       }
     }
   }
   ```
