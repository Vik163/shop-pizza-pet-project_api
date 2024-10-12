import { ConfigProps } from 'src/types/config.interface';

export const config = (): ConfigProps => ({
  port: 8000,
  option: [
    'https://pizzashop63.online, https://pizzashop163.ru, https://127.0.0.1:3000',
  ],
  access_secret: process.env.ACCESS_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
  time_refresh: process.env.TIME_TOKENS, // 15 дней
  // host
  api: process.env.API_URL || 'https://pizzashop163.ru',
  // yandexId ключи
  ya: {
    id: process.env.YA_CLIENT_ID_SERVER || process.env.YA_CLIENT_ID,
    secret: process.env.YA_CLIENT_SECRET_SERVER || process.env.YA_CLIENT_SECRET,
  },

  mongodb: {
    dbType: process.env.DB_TYPE || 'mongodb',
    mongoUrl: process.env.DB_MONGO || 'mongodb://localhost:27017/storedb',
    dbName: process.env.DB_BASE || 'storedb',
    dbPort: process.env.DB_PORT || 27017,
    dbHost: process.env.DB_HOST || '127.0.0.1',
  },

  sessions: {
    secretKey: process.env.SESSION_SECRET_KEY || 'this is a secret msg',
    sessName: process.env.SESSION_NAME || 'sessPizza',
    // cookieAge: 60 * 60 * 24 * 1000 * 30, // 30 дней
    sessTime: 60 * 60 * 24 * 1000 * process.env.TIME_SESS, // TIME_SESS 150 дней
    dbTime: 60 * 60 * 24 * process.env.TIME_SESS, // TIME_SESS 150 дней
  },
});
