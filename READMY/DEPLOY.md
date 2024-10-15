### Deploy

- `работать лучше в командной строке (полнее вывод, легче копировать)`

1. Создаю [виртуальный сервер](https://help.sweb.ru/nachal6naya-nastrojka-ubuntu-server-2204_1290.html) (при оформлении надо загрузить SSH ключи) на spaceweb и получаю данные доступа к серверу (login: root, password - xxxxxx)
   - права доступа:
     - root - администратор. через него можно создавать разделы сервера с разными пользователями и правами.
2. Создаю нового пользователя (шаг 2) vik:
   - из root `adduser vik`(vik - имя пользователя)=>password=>пропускаю доп. инфо=>`y`
   - административные задачи от имени пользователя root через sudo `usermod -aG sudo vik`
   - если создавать пользователя (vik), то создавать папки и файлы в `/home/vik` без `sudo` (`-rw-r--r-- 1 vik vik`, а не `-rw-r--r-- 1 root root`) будут проблемы с доступом
3. Связываю сервер "vik@server_ip" с компом: генерирую SSH если надо или использую готовые (для github в яндекс практикуме) ключи на компе, если не добавил при создании сервера
   - `ssh-keygen -t rsa -b 4096 -C "sfoto116@yandex.ru"` => `Enter`=>`Enter`=>password_key=>`eval $(ssh-agent -s)`=>`ssh-add ~/.ssh/id_rsa`
   - привязать к github `clip < ~/.ssh/id_rsa.pub` - если надо.
   - добавляю на сервер `ssh-copy-id -i ~/.ssh/id_rsa.pub server_login@server_ip`
4. Клонирую api репозиторий
5. Ключи NestJS кладу в папку nest_security, в той же директории, что и папка с проектом (локально лежат вместе в папке dev)(не )
6. Связываю сервер с github: `ssh-keygen`=>`cd .ssh/`=>`sudo nano ключ_pub`=>копирую и вставляю в github
7. Обновление ПО: `sudo apt update`=>`sudo apt list --upgradable`=>`sudo apt upgrade`=>`sudo reboot`
8. Получение доменного имени (без него никак)
9. Установка на сервер пользователя (не администратора) (C:\Users\user\Desktop\Cправочные материалы\Деплой\14 Подготовка и деплой бэкенда.pdf):

- node,
- [mongo](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/),
- nginx,

  - конфигурация: содаем символическую ссылку между sites-available и sites-enabled (Для конфигурации по умолчанию (default) символическая ссылка уже создана)

    ```javascript
     server {
        #   listen  80; // http - отключен
            server_name pizzashop63.online www.pizzashop63.online;

            root   /var/www/build; // папка для скопированного фронта если сервер root, иначе /home/vik/имя_проекта/папка_с_фронтом
        #   index  index.html index.htm; // работает без нее
        #   access_log  logs/host.access.log  main;

      // frontend
            location / {
            // если проект запускается на сервере.
              #  proxy_pass <https://127.0.0.1:3000>;
              #  proxy_http_version 1.1;
              #  proxy_set_header Upgrade $http_upgrade;
              #  proxy_set_header Connection 'upgrade';
              #  proxy_set_header Host $host;
              #  proxy_cache_bypass $http_upgrade;

            // если собирается build

                 if ($request_method = "GET") {
                     add_header "Access-Control-Allow-Origin"  "https://pizzashop63.online";
                     add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
                }

                // роутинг (production) (добавлено для решения ошибки 404 при обновлении страницы с маршрутом роута)
                 if (!-e $request_filename){
                     rewrite ^(.*)$ /index.html break;
                 }

              #  try_files $uri $uri/ /index.html; // отключил
        }

       // Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/pizzashop63.online/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/pizzashop63.online/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

        // backend

            location  ~ ^/api/(.*)$ {
                proxy_pass $scheme://127.0.0.1:8000/$1$is_args$args; // query
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        #       proxy_redirect     off;
        #       proxy_set_header   X-Real-IP        $remote_addr;
        #       proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            }
    }
       // Certbot
        server {
          if ($host = pizzashop63.online) {
              return 301 https://$host$request_uri;
        } # managed by Certbot


            listen       80;

            server_name pizzashop63.online www.pizzashop63.online;
        return 404; # managed by Certbot

    }

    ```

  - переходим `cd /etc/nginx/sites-available` создаем файл конфиг `sudo touch имя_файла`
  - сразу выполняем `sudo ln -s /etc/nginx/sites-available/имя_файла /etc/nginx/sites-enabled/имя_файла` проверяем ссылку
  - проверяем конфигурацию `sudo nginx -t` и если успешно перезагружаем `sudo systemctl restart nginx`
  - устанавливаю SSL-сертификат (от Letsencrypt для тестов) (в nestjs свои сертификаты)

- [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

  - (дополнительно пришлось поставить `sudo npm install -g bun`) - возможно не нужно
  - Захожу в папку с бекендом и собираю в production `npm run build`
  - запускаю pm2 `pm2 start dist/src/main.js`
  - либо создавать [файл конфигурации](https://pm2.keymetrics.io/docs/usage/application-declaration/), при использовании нескольких проектов, в корне проекта ecosystem.config.js c настройками

    ```javascript
    module.exports = {
      apps: [
        {
          name: 'nestjs-app',
          script: './dist/src/main.js',
          watch: true,
          env: {
            NODE_ENV: 'production',
          },
        },
      ],
    };
    ```

  - `pm2 start ecosystem.config.js`
  - для непрерывной работы `pm2 startup`, закопипастить сообщение, `pm2 save`

10. Добавление баз данных

    - вхожу в mongo `mongosh` с помощью [команд](https://www.forestadmin.com/blog/mongodb-cheat-sheet/) (есть шпаргалка js_guide) добавляю базы. Можно поставить compass, но он занимает много места вместе с ubuntu desktop.

11. Создаю папку с фронтендем и копирую туда build из проекта `scp -r ./build/* vik@77.222.52.250:/home/vik/shop-pizza-pet-project` (vs code terminal), для удобства можно добавить скрипт в package.json `"deploy": "npm run build && scp -r ./build/* vik@77.222.52.250:/home/vik/shop-pizza-pet-project",`
12. Копирование на сервере `sudo cp -R /home/vik/shop-pizza-pet-project/build/. /var/www/build`
