import { Injectable } from '@nestjs/common';

export interface HealthCheckResponse {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class HealthService {
  check(): HealthCheckResponse {
    return {
      success: true,
      status: 'UP',
      message: 'Rangoli Fashion API is running',
      timestamp: new Date().toISOString(),
    };
  }
}

