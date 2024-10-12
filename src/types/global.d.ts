declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      FIREBASE_SERVICE_ACCOUNT_KEY: string;
      DB_BASE: string;
      DB_PORT: number;
      DB_HOST: string;
      DB_MONGO: string;
      YA_CLIENT_ID_SERVER: string;
      YA_CLIENT_SECRET_SERVER: string;
      YA_CLIENT_ID: string;
      YA_CLIENT_SECRET: string;
      SESSION_SECRET_KEY: string;
      SESSION_NAME: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      CSRF_SECRET: string;
      TIME_SESS: number;
      TIME_TOKENS: number;
    }
  }
}
export {};
