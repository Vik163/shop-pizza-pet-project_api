# О Проекте

Проект создавал как вспомогательный для frontend.  
На курсах Яндекс Практикум изучал Express.js и TypeScript.
Теперь считаю, что без TypeScript никуда, поэтому выбрал NestJS.  
Практики с ним не было, но логика построения простого backend понятна.  
Насколько удачно вышло судить не могу, не бэкендер. Полуфабрикатами не пользовался, люблю все свое.

Кратко:

- База данных - mongoDB;
- TypeORM - применил для пагинации. Не углублялся;
- авторизация - Firebase (по телефону), Яндекс ID;
- безопасность - AccessToken, RefreshToken, CSRF;
- сессии - просто заморочился

Установленные пакеты:

```
  "dependencies": {
    "@nestjs/cache-manager": "^2.2.1",
    "@nestjs/common": "^10.2.1",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.2.1",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/mongoose": "^10.0.1",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/serve-static": "^4.0.0",
    "@nestjs/typeorm": "^10.0.2",
    "body-parser": "^1.20.2",
    "cache-manager": "^5.4.0",
    "class-validator": "^0.14.0",
    "connect-mongo": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "crypto": "^1.0.1",
    "csrf-csrf": "^3.0.3",
    "dotenv": "^16.4.1",
    "express-session": "^1.17.3",
    "firebase-admin": "^11.11.1",
    "mongoose": "^7.4.4",
    "nestjs-cls": "^3.6.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "typeorm": "^0.3.20",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.1.14",
    "@nestjs/schematics": "^10.0.2",
    "@types/cookie-parser": "^1.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.17",
    "@types/express-session": "^1.17.10",
    "@types/node": "20.5.3",
    "@types/passport": "^1.0.16",
    "@types/passport-jwt": "^4.0.1",
    "@types/uuid": "^9.0.7",
    "@typescript-eslint/eslint-plugin": "^6.4.1",
    "@typescript-eslint/parser": "^6.4.1",
    "eslint": "^8.47.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "prettier": "^3.0.2",
    "source-map-support": "^0.5.21",
    "ts-loader": "^9.4.4",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "4.2.0",
    "typescript": "^5.1.6"
  },
```
