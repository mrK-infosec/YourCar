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
exports.CarController = void 0;
const common_1 = require("@nestjs/common");
const car_service_1 = require("../services/car.service");
const zod_validation_pipe_1 = require("../utils/zod-validation.pipe");
const car_dto_1 = require("../dto/car.dto");
let CarController = class CarController {
    carService;
    constructor(carService) {
        this.carService = carService;
    }
    async create(createCarDto) {
        return await this.carService.create(createCarDto);
    }
    async findAll(query, req) {
        const requestId = req?.headers['x-request-id'] || 'no-trace';
        const startMemory = process.memoryUsage().heapUsed;
        const data = await this.carService.findAll(query);
        const endMemory = process.memoryUsage().heapUsed;
        const memoryDeltaKB = Math.round((endMemory - startMemory) / 1024);
        console.log(`[Metrics] [CarListingsings] RequestID: ${requestId} | Memory Delta: ${memoryDeltaKB} KB | Heap: ${Math.round(endMemory / 1024 / 1024)} MB`);
        return data;
    }
    async getBestDeals(limit) {
        const limitCap = limit ? parseInt(limit, 10) : 10;
        return await this.carService.getBestDeals(limitCap);
    }
    async findOne(id) {
        return await this.carService.findOne(id);
    }
    async update(id, updateCarDto) {
        return await this.carService.update(id, updateCarDto);
    }
    async remove(id) {
        await this.carService.remove(id);
        return {
            message: 'Car listing removed successfully',
        };
    }
};
exports.CarController = CarController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(car_dto_1.CreateCarSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('best-deals'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getBestDeals", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(car_dto_1.UpdateCarSchema)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "remove", null);
exports.CarController = CarController = __decorate([
    (0, common_1.Controller)('api/cars'),
    __metadata("design:paramtypes", [car_service_1.CarService])
], CarController);
//# sourceMappingURL=car.controller.js.map