import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'API Health Check' })
  @ApiResponse({
    status: 200,
    description: 'API is running and healthy',
    schema: {
      example: {
        success: true,
        status: 'UP',
        message: 'Rangoli Fashion API is running',
        timestamp: '2026-11-18T13:45:00.000Z',
      },
    },
  })
  check(@Res() res: Response) {
    const health = this.healthService.check();
    return res.status(HttpStatus.OK).json(health);
  }
}

