"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    memoryCache = new Map();
    async get(key) {
        const cached = this.memoryCache.get(key);
        if (!cached) {
            return null;
        }
        if (Date.now() > cached.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        return cached.value;
    }
    async set(key, value, ttlInSeconds = 300) {
        const expiresAt = Date.now() + ttlInSeconds * 1000;
        this.memoryCache.set(key, { value, expiresAt });
    }
    async delete(key) {
        this.memoryCache.delete(key);
    }
    async clear() {
        this.memoryCache.clear();
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map