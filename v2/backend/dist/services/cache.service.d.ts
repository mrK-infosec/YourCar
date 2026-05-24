export declare class CacheService {
    private memoryCache;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlInSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
