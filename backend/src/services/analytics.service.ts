import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from '../entities/analytics.entity';
import { Url } from '../entities/url.entity';
import {
  AnalyticsResponseDto,
  ClickAnalyticsDto,
} from '../dto/analytics-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  /**
   * Get comprehensive analytics for a short URL
   */
  async getUrlAnalytics(identifier: string): Promise<AnalyticsResponseDto> {
    // Find the URL by identifier directly to avoid circular dependency
    const url = await this.urlRepository.findOne({
      where: [{ shortCode: identifier }, { alias: identifier }],
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.isExpired) {
      throw new NotFoundException('Short URL has expired');
    }

    // Get all analytics for this URL
    const analytics = await this.analyticsRepository.find({
      where: { urlId: url.id },
      order: { clickedAt: 'DESC' },
    });

    // Calculate basic stats
    const totalClicks = analytics.length;
    const uniqueClicks = new Set(analytics.map((a) => a.ipAddress)).size;

    // Get recent clicks (last 5)
    const recentClicks: ClickAnalyticsDto[] = analytics
      .slice(0, 5)
      .map((click) => ({
        ipAddress: click.maskedIpAddress, // Use masked IP for privacy
        clickedAt: click.clickedAt,
        countryCode: click.countryCode,
        referrer: click.referrer,
      }));

    // Calculate daily stats for the last 7 days
    const dailyStats = await this.calculateDailyStats(url.id);

    // Calculate top referrers
    const topReferrers = await this.calculateTopReferrers(url.id);

    return {
      url: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        alias: url.alias,
        createdAt: url.createdAt,
      },
      totalClicks,
      uniqueClicks,
      recentClicks,
      dailyStats,
      topReferrers,
    };
  }

  /**
   * Get click statistics grouped by day for the last 7 days
   */
  private async calculateDailyStats(
    urlId: string,
  ): Promise<Array<{ date: string; clicks: number }>> {
    // Get date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const query = `
      SELECT
        DATE(clicked_at) as date,
        COUNT(*) as clicks
      FROM analytics
      WHERE url_id = $1
        AND clicked_at >= $2
      GROUP BY DATE(clicked_at)
      ORDER BY date DESC
    `;

    const result = await this.analyticsRepository.query(query, [
      urlId,
      sevenDaysAgo,
    ]);

    // Fill in missing dates with 0 clicks
    const dateMap = new Map<string, number>();
    result.forEach((row: any) => {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      dateMap.set(dateStr, parseInt(row.clicks));
    });

    const dailyStats: Array<{ date: string; clicks: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      dailyStats.push({
        date: dateStr,
        clicks: dateMap.get(dateStr) || 0,
      });
    }

    return dailyStats;
  }

  /**
   * Get top 5 referrer domains
   */
  private async calculateTopReferrers(
    urlId: string,
  ): Promise<Array<{ domain: string; clicks: number }>> {
    const query = `
      SELECT
        CASE
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          ELSE SPLIT_PART(SPLIT_PART(referrer, '://', 2), '/', 1)
        END as domain,
        COUNT(*) as clicks
      FROM analytics
      WHERE url_id = $1
        AND referrer IS NOT NULL
      GROUP BY domain
      ORDER BY clicks DESC
      LIMIT 5
    `;

    const result = await this.analyticsRepository.query(query, [urlId]);

    return result.map((row: any) => ({
      domain: row.domain || 'Direct',
      clicks: parseInt(row.clicks),
    }));
  }

  /**
   * Get recent clicks for all URLs (admin function)
   */
  async getRecentActivity(limit: number = 10): Promise<ClickAnalyticsDto[]> {
    const analytics = await this.analyticsRepository.find({
      relations: ['url'],
      order: { clickedAt: 'DESC' },
      take: limit,
    });

    return analytics.map((click) => ({
      ipAddress: click.maskedIpAddress,
      clickedAt: click.clickedAt,
      countryCode: click.countryCode,
      referrer: click.referrer,
    }));
  }

  /**
   * Get analytics summary for all URLs
   */
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
    // Total URLs count
    const totalUrls = await this.urlRepository.count();

    // Total clicks count
    const totalClicks = await this.analyticsRepository.count();

    // Unique visitors (unique IP addresses)
    const uniqueVisitorsQuery = `
      SELECT COUNT(DISTINCT ip_address) as unique_visitors
      FROM analytics
    `;
    const uniqueVisitorsResult =
      await this.analyticsRepository.query(uniqueVisitorsQuery);
    const uniqueVisitors = parseInt(
      uniqueVisitorsResult[0]?.unique_visitors || '0',
    );

    // Top 5 URLs by clicks
    const topUrlsQuery = `
      SELECT
        u.short_code,
        u.custom_alias as alias,
        u.original_url,
        u.click_count as clicks
      FROM urls u
      ORDER BY u.click_count DESC
      LIMIT 5
    `;
    const topUrlsResult = await this.urlRepository.query(topUrlsQuery);

    const topUrls = topUrlsResult.map((row: any) => ({
      shortCode: row.short_code,
      alias: row.alias,
      originalUrl: row.original_url,
      clicks: parseInt(row.clicks),
    }));

    return {
      totalUrls,
      totalClicks,
      uniqueVisitors,
      topUrls,
    };
  }
}
