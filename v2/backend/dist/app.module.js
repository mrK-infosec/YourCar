"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const car_controller_1 = require("./controllers/car.controller");
const car_service_1 = require("./services/car.service");
const car_repository_1 = require("./repositories/car.repository");
const logging_middleware_1 = require("./middleware/logging.middleware");
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const app_repository_1 = require("./repositories/app.repository");
const cache_service_1 = require("./services/cache.service");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = __importDefault(require("./config/configuration"));
const mongoose = __importStar(require("mongoose"));
const config = (0, configuration_1.default)();
const mongooseConnectionProvider = {
    provide: (0, mongoose_1.getConnectionToken)(),
    useFactory: async () => {
        try {
            console.log('Attempting singleton MongoDB connection...');
            await mongoose.connect(config.mongodbUri, {
                maxPoolSize: 50,
                serverSelectionTimeoutMS: 2000,
            });
            console.log('MongoDB connection established successfully! (Singleton)');
        }
        catch (err) {
            console.error('MongoDB connection failed:', err.message);
            console.log('Warning: Server will continue booting, but database operations will fail.');
        }
        const connection = mongoose.connection || mongoose.connections[0];
        return connection || { readyState: 0, db: { databaseName: 'offline' } };
    },
};
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_id_middleware_1.RequestIdMiddleware, logging_middleware_1.LoggingMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, car_controller_1.CarController],
        providers: [
            app_service_1.AppService,
            app_repository_1.AppRepository,
            car_service_1.CarService,
            car_repository_1.CarRepository,
            cache_service_1.CacheService,
            mongooseConnectionProvider,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map