import { ApiProperty } from '@nestjs/swagger';

export class ClickAnalyticsDto {
  @ApiProperty({
    description: 'IP address that clicked the link',
    example: '192.168.1.***',
  })
  ipAddress: string;

  @ApiProperty({
    description: 'Date and time when the link was clicked',
    example: '2024-01-15T14:30:00.000Z',
  })
  clickedAt: Date;

  @ApiProperty({
    description: 'Country code of the click origin',
    example: 'US',
    required: false,
  })
  countryCode?: string;

  @ApiProperty({
    description: 'Referrer URL',
    example: 'https://google.com',
    required: false,
  })
  referrer?: string;
}

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'URL information',
  })
  url: {
    id: string;
    originalUrl: string;
    shortCode: string;
    alias?: string;
    createdAt: Date;
  };

  @ApiProperty({
    description: 'Total number of clicks',
    example: 42,
  })
  totalClicks: number;

  @ApiProperty({
    description: 'Number of unique IP addresses',
    example: 28,
  })
  uniqueClicks: number;

  @ApiProperty({
    description: 'Last 5 click records',
    type: [ClickAnalyticsDto],
  })
  recentClicks: ClickAnalyticsDto[];

  @ApiProperty({
    description: 'Daily click statistics for the last 7 days',
    example: [
      { date: '2024-01-15', clicks: 5 },
      { date: '2024-01-14', clicks: 3 },
    ],
  })
  dailyStats: Array<{
    date: string;
    clicks: number;
  }>;

  @ApiProperty({
    description: 'Top 5 referrer domains',
    example: [
      { domain: 'google.com', clicks: 15 },
      { domain: 'facebook.com', clicks: 8 },
    ],
  })
  topReferrers: Array<{
    domain: string;
    clicks: number;
  }>;
}
