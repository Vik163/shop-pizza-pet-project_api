### Защита CSRF

1. Защиту реализую только на формы POST- запросов
2. Использовал [_Double CSRF_](https://www.npmjs.com/package/csrf-csrf) :

---

npm install cookie-parser csrf-csrf

---

3. Создал файл `csrf.config.ts` и вернул: `validateRequest` - проверка csrf (использовать в guard не рекомендуется), `doubleCsrfProtection`
4. В `main.ts` последней мидлварой
5. куки создаются по умолчанию с httpOnly: true (можно перезаписать самому)
6. req.csrfToken(true) - true перезаписывает токен при вызове, если false, токен не меняется. Когда открыто несколько вкладок с
   перезаписываемым токеном могут быть проблемы нужно писать доп логику на обновление

```javascript
app.use(doubleCsrfProtection);
```

- На клиенте:

  - получаю токен в ответе на запрос '/csrf' и сохраняю в redux
  - токен храниться либо в форме (&lt;form>), либо в состоянии React или Redux (куки и хранилище не использую)
  - при вызове формы на клиенте посылаю запрос на csrf-токен
  - после получения csrf-токена: установка csrf-токена в headers, отправляю форму

- На сервере проверка csrf-токена, кроме методов по умолчанию `ignoredMethods: ["GET", "HEAD", "OPTIONS"]` , (в защитнике CsrfGuard c декоратором @Csrf) функцией:

```javascript
validateRequest(req); // булевое значение
```
