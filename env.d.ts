declare namespace NodeJS {
  interface ProcessEnv {
    MONG0DB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
  }
}
