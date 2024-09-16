export interface ConfigProps {
  port: number;
  option: string[];
  access_secret: string;
  refresh_secret: string;
  time_refresh: number;
  api: string;
  mongodb: {
    dbType: string;
    mongoUrl: string;
    dbName: string;
    dbHost: string;
    dbPort: number;
  };
  sessions: {
    secretKey: string;
    sessName: string;
    sessTime: number;
    dbTime: number;
  };
  ya: {
    id: string;
    secret: string;
  };
}
