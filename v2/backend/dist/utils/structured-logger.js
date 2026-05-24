"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
const common_1 = require("@nestjs/common");
const configuration_1 = require("../config/configuration");
let StructuredLogger = class StructuredLogger {
    config = (0, configuration_1.getConfiguration)();
    log(message, ...optionalParams) {
        this.printLog('info', message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.printLog('error', message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.printLog('warn', message, ...optionalParams);
    }
    debug(message, ...optionalParams) {
        if (this.config.nodeEnv !== 'production') {
            this.printLog('debug', message, ...optionalParams);
        }
    }
    verbose(message, ...optionalParams) {
        if (this.config.nodeEnv !== 'production') {
            this.printLog('verbose', message, ...optionalParams);
        }
    }
    printLog(level, message, ...optionalParams) {
        const timestamp = new Date().toISOString();
        const context = optionalParams[optionalParams.length - 1] || 'App';
        if (this.config.nodeEnv === 'production') {
            console.log(JSON.stringify({
                level,
                timestamp,
                context,
                message: typeof message === 'object' ? message : { msg: message },
            }));
        }
        else {
            const colorMap = {
                info: '\x1b[36m',
                warn: '\x1b[33m',
                error: '\x1b[31m',
                debug: '\x1b[35m',
                verbose: '\x1b[32m'
            };
            const color = colorMap[level] || '\x1b[37m';
            const reset = '\x1b[0m';
            console.log(`${color}[StructuredLogger - ${level.toUpperCase()}]${reset} [${context}] ${timestamp} | ${typeof message === 'object' ? JSON.stringify(message) : message}`);
        }
    }
};
exports.StructuredLogger = StructuredLogger;
exports.StructuredLogger = StructuredLogger = __decorate([
    (0, common_1.Injectable)()
], StructuredLogger);
exports.default = StructuredLogger;
//# sourceMappingURL=structured-logger.js.map