### [Доменное имя для localhost](https://codertime.ru/blog-ru/kak-sozdat-lokalnyy-polzovatelskiy-domen-na-localhost-s-pomoshchyu-servera-apache/)

В папке _hosts_ `C:\Windows\System32\drivers\etc` добавляем строку
(не использовать `.com .ru`)

```
127.0.0.1 _имя хоста_
127.0.0.1 _api.имя хоста_
```

### [nginx под Windows](https://nginx.org/ru/docs/windows.html)

- Установка
  - Скачиваем дистрибутив [nginx](https://nginx.org/ru/download.html)
  - распаковываем папку на диск С
- Управление
  - В командной строке заходим в эту папку
  - Команды:

```bash
start nginx                             # - запуск
tasklist /fi "imagename eq nginx.exe"   # - просмотр рабочих процессов
nginx -s stop                           # - быстрое завершение
nginx -s quit                           # - плавное завершение
nginx -s reload                         # - изменение конфигурации, запуск новых рабочих процессов с новой конфигурацией, плавное завершение старых рабочих процессов
nginx -s reopen                         # - переоткрытие лог-файлов
```

- Config
  - [Основная функциональность](https://nginx.org/ru/docs/ngx_core_module.html)
  - [Config](https://wiki.merionet.ru/articles/nastrojka-proizvoditelnosti-i-bezopasnosti-nginx/?ysclid=lr25uxu0t590297650)
  - HTTP config (Справочники => Деплой)

```bash
# от 1 до auto - много процессов (не больше чем ядер в компе)
# с 1 локально работает
worker_processes  1;

# логи (если нужны)
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

# В .pid-файлах хранят просто идентификатор процесса
#pid        logs/nginx.pid;

# 1024, что позволяет одному воркеру одновременно принимать соединение от клиента
events {
    worker_connections  1024;
}

# location section и server section могут быть вложены в разделе http section, чтобы сделать конфигурацию более читабельной.
http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

--- HTTP -------------------------------------------------------------------------------

    server {
        listen       80;
        # -- HTTPS -------------
        listen       443 ssl;
        #-----------------------

        server_name pizzashop163.ru www.pizzashop163.ru;

        access_log  logs/host.access.log  main;

        # -- HTTPS -------------
        ssl_certificate     ../../dev/shop-pizza-pet-project/backend/security/pizzashop163.ru+4.pem;
        ssl_certificate_key ../../dev/shop-pizza-pet-project/backend/security/pizzashop163.ru+4-key.pem;
        #-----------------------

        # Статичная сборка из папки build
        # root   ../dev/shop-pizza-pet-project/frontend/build;
        # index  index.html index.htm;

        # Роутинг (production)
        # location / {
        #     try_files $uri $uri/ /index.html;
        # }

        # dev-server сборка
        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # бекенд через api/
        location  ~ ^/api/(.*)$ {
           # $is_args$args - query параметры
            proxy_pass $scheme://127.0.0.1:8000/$1$is_args$args;
            proxy_redirect     off;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        # error_page   500 502 503 504  /50x.html;
        # location = /50x.html {
        #     root   html;
        # }
    }
```
