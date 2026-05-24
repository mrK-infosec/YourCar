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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./utils/http-exception.filter");
const transform_interceptor_1 = require("./utils/transform.interceptor");
const configuration_1 = require("./config/configuration");
const structured_logger_1 = require("./utils/structured-logger");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express = __importStar(require("express"));
async function bootstrap() {
    const config = (0, configuration_1.getConfiguration)();
    const logger = new structured_logger_1.StructuredLogger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger });
    app.use((0, helmet_1.default)());
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use('/api', (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: config.rateLimitMax,
        message: {
            success: false,
            error: {
                message: 'Too many requests from this IP. Please try again after 15 minutes.',
                code: 'TOO_MANY_REQUESTS'
            }
        },
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.enableCors({
        origin: config.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    });
    await app.listen(config.port);
    logger.log(`=========================================`, 'Bootstrap');
    logger.log(` Revora v2 NestJS Backend booting...`, 'Bootstrap');
    logger.log(` Environment: [${config.nodeEnv}]`, 'Bootstrap');
    logger.log(` Listening on: http://localhost:${config.port}`, 'Bootstrap');
    logger.log(`=========================================`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map