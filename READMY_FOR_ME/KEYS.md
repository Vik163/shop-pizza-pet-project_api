### Установка сертификатов для https

- Использую [mkcert](https://www.npmjs.com/package/mkcert) `npm i mkcert`
- или Установка mkcert для Windows

  - использую Chocolatey (устанавливаю на винду, если нет)
  - в командной строке `choco install mkcert` (устанавливаются сертификаты: rootCA.pem и rootCA-key.pem в папке C:\Users\user\AppData\Local\mkcert)

  ```
  успешная установка
  Created a new local CA at "C:\Users\user\AppData\Local\mkcert" 💥
  The local CA is now installed in the system trust store! ⚡️
  The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊
  ```

  - создаем папку для сертификатов в корне -> /security,
  - заходим в /security и в терминале выполняем команду,

```
mkcert имя_сайта.ru "*.имя_сайта.ru" 127.0.0.1 ::1
```

```
успешная установка
Using the local CA at "/Users/filippo/Library/Application Support/mkcert" ✨

Created a new certificate valid for the following names 📜
 - "имя_сайта.ru"
 - "*.имя_сайта.ru"
 - "127.0.0.1"
 - "::1"

The certificate is at "./имя_сайта.ru+5.pem" and the key at "./имя_сайта.ru+5-key.pem" ✅
```

- в main.ts добавляем:

```javascript
const httpsOptions = {
  key: readFileSync('./security/имя_сайта.ru+5-key.key'),
  cert: readFileSync('./security/имя_сайта.ru+5.pem.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
}
```

- выходим в корневую папку и в терминале запускаем приложение,
- mkcert Postman
  - settings > certifikates
  - включаем CA certificates и добавляем rootCA.pem из mkcert
  - добавляем клиентские сертификаты
