import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';
import {
  AnalyticsResponseDto,
  ClickAnalyticsDto,
} from '../dto/analytics-response.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get URL analytics',
    description:
      'Retrieves comprehensive analytics data for a specific short URL including click statistics, daily trends, and referrer information',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Short code or custom alias of the URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data retrieved successfully',
    type: AnalyticsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async getUrlAnalytics(
    @Param('identifier') identifier: string,
  ): Promise<AnalyticsResponseDto> {
    return await this.analyticsService.getUrlAnalytics(identifier);
  }

  @Get('admin/recent-activity')
  @ApiOperation({
    summary: 'Get recent click activity',
    description:
      'Retrieves recent click activity across all URLs (admin function)',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of recent clicks to return',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
    type: [ClickAnalyticsDto],
  })
  async getRecentActivity(
    @Query('limit') limit?: string,
  ): Promise<ClickAnalyticsDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.analyticsService.getRecentActivity(limitNumber);
  }

  @Get('admin/global-stats')
  @ApiOperation({
    summary: 'Get global statistics',
    description:
      'Retrieves global statistics including total URLs, clicks, and top performing URLs',
  })
  @ApiResponse({
    status: 200,
    description: 'Global statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalUrls: {
          type: 'number',
          description: 'Total number of shortened URLs',
          example: 1250,
        },
        totalClicks: {
          type: 'number',
          description: 'Total number of clicks across all URLs',
          example: 5672,
        },
        uniqueVisitors: {
          type: 'number',
          description: 'Number of unique IP addresses that clicked links',
          example: 3401,
        },
        topUrls: {
          type: 'array',
          description: 'Top 5 URLs by click count',
          items: {
            type: 'object',
            properties: {
              shortCode: { type: 'string', example: 'abc123' },
              alias: { type: 'string', example: 'my-link', nullable: true },
              originalUrl: { type: 'string', example: 'https://example.com' },
              clicks: { type: 'number', example: 245 },
            },
          },
        },
      },
    },
  })
  async getGlobalStats(): Promise<{
    totalUrls: number;
    totalClicks: number;
    uniqueVisitors: number;
    topUrls: Array<{
      shortCode: string;
      alias?: string;
      originalUrl: string;
      clicks: number;
    }>;
  }> {
    return await this.analyticsService.getGlobalStats();
  }
}
