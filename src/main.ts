import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { doubleCsrfProtection } from './config/csrf.config';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoStore = require('connect-mongo');

// https сертификаты --------------------------
const httpsOptions = {
  key: readFileSync('../nest_security/pizzashop163.ru+4-key.pem'),
  cert: readFileSync('../nest_security/pizzashop163.ru+4.pem'),
};

async function bootstrap() {
  // c https
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>('port');
  const option = configService.get<string[]>('option');
  const dbTime = configService.get<number>('sessions.dbTime');
  const sessCookieAge = configService.get<number>('sessions.sessTime');
  const mongoUrl = configService.get<string>('mongodb.mongoUrl');
  const sessName = configService.get<string>('sessions.sessName');
  const secretKey = configService.get<string>('sessions.secretKey');

  app.enableCors();

  app.use(cookieParser());
  app.use(
    cors({
      origin: option,
      methods: 'HEAD,PUT,POST,DELETE,OPTIONS',
      credentials: true,
    }),
  );

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: mongoUrl,
        // 30 дней
        ttl: dbTime,
        autoRemove: 'native',
      }),
      name: sessName,
      secret: secretKey,
      // указывает, нужно ли пересохранять сессию в хранилище, если она не изменилась (по умолчанию false);
      resave: false,
      // если true, то в хранилище будут попадать пустые сессии;
      saveUninitialized: false,
      cookie: {
        secure: true,
        signed: true,
        sameSite: 'strict',
        // 30 дней
        maxAge: sessCookieAge,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.use(passport.initialize());
  app.use(doubleCsrfProtection);

  await app.listen(port);
  console.log(`server listen port ${port}`);
}
bootstrap();
