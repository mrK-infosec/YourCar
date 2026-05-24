import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();

  /**
   * Safe asynchronous get method to support Redis migration in the future.
   */
  async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  /**
   * Safe asynchronous set method.
   * @param ttlInSeconds defaults to 300 seconds (5 minutes)
   */
  async set(key: string, value: any, ttlInSeconds = 300): Promise<void> {
    const expiresAt = Date.now() + ttlInSeconds * 1000;
    this.memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Safe asynchronous delete/invalidate method.
   */
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }

  /**
   * Clear all entries.
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
  }
}
