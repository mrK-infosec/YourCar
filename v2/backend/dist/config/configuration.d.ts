export interface AppConfig {
    port: number;
    mongodbUri: string;
    nodeEnv: string;
    corsOrigins: string[];
    rateLimitMax: number;
    jwtSecret: string;
}
export declare const getConfiguration: () => AppConfig;
export default getConfiguration;
