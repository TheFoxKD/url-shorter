import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns the health status of the service and database connectivity',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        uptime: { type: 'number', example: 3600.5 },
        database: { type: 'string', example: 'connected' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy',
  })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    database: string;
    version: string;
  }> {
    let databaseStatus = 'disconnected';

    try {
      // Test database connection by running a simple query
      await this.urlRepository.query('SELECT 1');
      databaseStatus = 'connected';
    } catch (error) {
      databaseStatus = 'error';
    }

    return {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: databaseStatus,
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
