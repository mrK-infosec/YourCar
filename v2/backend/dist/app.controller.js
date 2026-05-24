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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("./utils/zod-validation.pipe");
const zod_1 = require("zod");
const app_service_1 = require("./app.service");
const TestValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: 'Name must be at least 3 characters' }),
    age: zod_1.z.number().min(18, { message: 'Must be at least 18 years old' }),
    email: zod_1.z.string().email({ message: 'Must be a valid UAE email format' }),
});
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async getStatus(triggerError, req) {
        if (triggerError === 'true') {
            throw new common_1.BadRequestException('Verification exception forced by status debug flag!');
        }
        const requestId = req?.headers['x-request-id'] || 'no-trace';
        const startMemory = process.memoryUsage().heapUsed;
        const dbStatus = await this.appService.getDatabaseStatus();
        const endMemory = process.memoryUsage().heapUsed;
        const memoryDeltaKB = Math.round((endMemory - startMemory) / 1024);
        console.log(`[Metrics] RequestID: ${requestId} | Memory Delta: ${memoryDeltaKB} KB | Current Heap: ${Math.round(endMemory / 1024 / 1024)} MB`);
        return dbStatus;
    }
    testValidation(body) {
        return {
            message: 'Payload verified successfully',
            payload: body,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('trigger-error')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('test-validation'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(TestValidationSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "testValidation", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map