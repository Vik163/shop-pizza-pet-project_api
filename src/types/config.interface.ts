export interface ConfigProps {
  port: number;
  option: string[];
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
    cookieAge: number;
    dbAge: number;
  };
  ya: {
    id: string;
    secret: string;
  };
}
