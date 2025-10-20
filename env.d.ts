declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
  }
}
