declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_SERVICE_ACCOUNT_KEY: string;
      DB_TYPE: 'mongodb';
      DB_BASE: string;
      DB_PORT: number;
      DB_MONGO: string;
      YA_CLIENT_ID: string;
      YA_CLIENT_SECRET: string;
      SESSION_SECRET_KEY: string;
      SESSION_NAME: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      CSRF_SECRET: string;
      TIME_REFRESH: number;
    }
  }
}
export {};
