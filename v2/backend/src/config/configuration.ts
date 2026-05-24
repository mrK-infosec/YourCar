export interface AppConfig {
  port: number;
  mongodbUri: string;
  nodeEnv: string;
  corsOrigins: string[];
  rateLimitMax: number;
  jwtSecret: string;
}

export const getConfiguration = (): AppConfig => {
  const env = process.env.NODE_ENV || 'development';
  const rawOrigins = process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173';

  return {
    port: parseInt(process.env.PORT || '5000', 10),
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/revora_v2',
    nodeEnv: env,
    corsOrigins: rawOrigins.split(',').map((origin) => origin.trim()),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    jwtSecret: process.env.JWT_SECRET || 'RevoraUAEEliteSuperSecretJWTKey2026!',
  };
};

export default getConfiguration;
