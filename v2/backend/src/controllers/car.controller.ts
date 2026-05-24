import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  UsePipes,
  Req,
} from '@nestjs/common';
import { CarService } from '../services/car.service';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';
import { CreateCarSchema, UpdateCarSchema } from '../dto/car.dto';

@Controller('api/cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCarSchema))
  async create(@Body() createCarDto: any) {
    return await this.carService.create(createCarDto);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>, @Req() req: any) {
    const requestId = req?.headers['x-request-id'] || 'no-trace';
    const startMemory = process.memoryUsage().heapUsed;

    const data = await this.carService.findAll(query);

    const endMemory = process.memoryUsage().heapUsed;
    const memoryDeltaKB = Math.round((endMemory - startMemory) / 1024);

    console.log(
      `[Metrics] [CarListingsings] RequestID: ${requestId} | Memory Delta: ${memoryDeltaKB} KB | Heap: ${Math.round(
        endMemory / 1024 / 1024
      )} MB`
    );

    return data;
  }

  @Get('best-deals')
  async getBestDeals(@Query('limit') limit?: string) {
    const limitCap = limit ? parseInt(limit, 10) : 10;
    return await this.carService.getBestDeals(limitCap);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateCarSchema))
  async update(@Param('id') id: string, @Body() updateCarDto: any) {
    return await this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.carService.remove(id);
    return {
      message: 'Car listing removed successfully',
    };
  }
}
