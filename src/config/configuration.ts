import { ConfigProps } from 'src/types/config.interface';

export const config = (): ConfigProps => ({
  port: 8000,
  option: [
    'https://pizzashop63.online, https://pizzashop163.ru, https://127.0.0.1:3000',
  ],
  api: process.env.API_URL || 'https://pizzashop163.ru',

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
    cookieAge: 60 * 60 * 24 * 1000 * 30,
    dbAge: 60 * 60 * 24 * 30,
  },
});
