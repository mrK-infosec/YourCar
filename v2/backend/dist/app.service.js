"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const app_repository_1 = require("./repositories/app.repository");
const cache_service_1 = require("./services/cache.service");
let AppService = class AppService {
    appRepository;
    cacheService;
    constructor(appRepository, cacheService) {
        this.appRepository = appRepository;
        this.cacheService = cacheService;
    }
    async getDatabaseStatus() {
        const cacheKey = 'db_status';
        const cachedStatus = await this.cacheService.get(cacheKey);
        if (cachedStatus) {
            console.log('Retrieving database status from cache (Optimized Cache Hit)');
            return cachedStatus;
        }
        const status = await this.appRepository.getDatabaseStatus();
        await this.cacheService.set(cacheKey, status, 10);
        console.log('Database status queried from repository and cached (Cache Miss)');
        return status;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_repository_1.AppRepository,
        cache_service_1.CacheService])
], AppService);
//# sourceMappingURL=app.service.js.map