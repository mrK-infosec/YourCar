import { Injectable } from '@nestjs/common';
import { AppRepository, DatabaseStatus } from './repositories/app.repository';
import { CacheService } from './services/cache.service';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly cacheService: CacheService
  ) {}

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    const cacheKey = 'db_status';
    
    // Check cache
    const cachedStatus = await this.cacheService.get<DatabaseStatus>(cacheKey);
    if (cachedStatus) {
      console.log('Retrieving database status from cache (Optimized Cache Hit)');
      return cachedStatus;
    }

    // Cache miss, query repository
    const status = await this.appRepository.getDatabaseStatus();
    
    // Cache for 10 seconds to limit DB load
    await this.cacheService.set(cacheKey, status, 10);
    console.log('Database status queried from repository and cached (Cache Miss)');
    
    return status;
  }
}
