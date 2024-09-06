### Установка ключей для https

- создаем папку для ключей в корне -> /security,
- в папке файл -> req.cnf,

```
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = NG
ST = Lagos
L = Ikeja
O = Acme
OU = Dev
CN = localhost
[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = www.localhost.com
DNS.2 = localhost.com
DNS.3 = localhost
```

- заходим в /security и в терминале выполняем команду,

---

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256

---

- в main.ts добавляем:

```javascript
const httpsOptions = {
  key: readFileSync('./security/cert.key'),
  cert: readFileSync('./security/cert.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
}
```

- выходим в корневую папку и в терминале запускаем приложение,

_Установку сертификата делаем в браузере chrom_

- devTools => security => View Certificate,
- полученный сертификат экспортируем в любую папку и называем его localhost.cer,
- переходим в настройки браузера => безопасность => управление сертификатами,
- импортируем его в доверенные корневые сертификаты,
- перезагружем браузер
