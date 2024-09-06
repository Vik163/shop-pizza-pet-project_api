### Проверка токенов

- Генерируются в token.servise
- [Использую @nestjs/passport](https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token)
- Создаю accessToken.strategy.ts and refreshToken.strategy.ts в папке auth/strategies
  - refresh достаю `jwtFromRequest: (req: Request) => req.cookies.refreshToken,`
- Создаю accessToken.guard.ts and refreshToken.guard.ts в папке src/common/guards
- Создаю accessToken.decorator.ts (@AccessToken()) and refreshToken.decorator.ts (@RefreshToken()) в папке src/common/decorators
- Созданные токены отправляются (не хешируются) на клиент (access - доступный, refresh - httpOnly) в куки, потом refresh хешируется argon2 для БД
- Обновление токенов на маршруте /refresh полсе проверки на валидность
  - запрашивается в БД refresh и верифицирутся argon2 с полученым из куки
  - проверяется refresh на время хранения и либо создаются оба и refresh обновляется в БД, либо только access
