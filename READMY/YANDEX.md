### Yandex

- [Регистрация приложения](https://yandex.ru/dev/id/doc/ru/register-client)
  - сохраняю ключи в файл .env редирект указываю на бекенд `https://pizzashop163.ru/api/yandex`
- [Получение кода подтверждения из URL](https://yandex.ru/dev/id/doc/ru/codes/code-url)
  - На клиенте: по ссылке переход на страницу авторизации яндекса и отправка в headers токена безопасности state
  - после - переадресация на бекенд (в query параметрах передача кода подтверждения и токен безопасности state)
  - создал [КЕШ](https://docs.nestjs.com/techniques/caching) (при запросе токен state из headers сохраняется в кеше и после верификации удаляется), создать [локальное хранилище](https://yandex.ru/dev/id/doc/ru/codes/code-url) не получилось, наверно из-за переадресации
  - отправление кода и получение данных:

```
  200 OK
Content-type: application/json

{
"token_type": "bearer",
"access_token": "AQAAAACy1C6ZAAAAfa6vDLuItEy8pg-iIpnDxIs",
"expires_in": 124234123534,
"refresh_token": "1:GN686QVt0mmakDd9:A4pYuW9LGk0_UnlrMIWklkAuJkUWbq27loFekJVmSYrdfzdePBy7:A-2dHOmBxiXgajnD-kYOwQ",
"scope": "login:info login:email login:avatar"
}
```

- [Обмен токена на информацию о пользователе](https://yandex.ru/dev/id/doc/ru/user-information)
  - отправляю токен и получаю данные пользователя из которых выбираю, что нужно
  - проверяю в БД пользователя если нет, то создаю
  - после - переадресация res.redirect с данными пользователя в query `https://pizzashop163.ru?user=${JSON.stringify(newUser)}`
