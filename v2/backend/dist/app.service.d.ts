import { AppRepository, DatabaseStatus } from './repositories/app.repository';
import { CacheService } from './services/cache.service';
export declare class AppService {
    private readonly appRepository;
    private readonly cacheService;
    constructor(appRepository: AppRepository, cacheService: CacheService);
    getDatabaseStatus(): Promise<DatabaseStatus>;
}
