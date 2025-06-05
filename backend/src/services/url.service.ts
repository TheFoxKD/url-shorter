import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from '../entities/url.entity';
import { Analytics } from '../entities/analytics.entity';
import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponseDto } from '../dto/url-response.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new short URL
   */
  async createShortUrl(createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const { originalUrl, alias, expiresAt } = createUrlDto;

    // Check if custom alias is already taken
    if (alias) {
      const existingUrl = await this.urlRepository.findOne({
        where: { alias },
      });
      if (existingUrl) {
        throw new ConflictException(`Alias "${alias}" is already taken`);
      }
    }

    // Generate unique short code
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = this.generateShortCode();
      attempts++;

      const existing = await this.urlRepository.findOne({
        where: { shortCode },
      });

      if (!existing) break;

      if (attempts >= maxAttempts) {
        throw new BadRequestException(
          'Unable to generate unique short code. Please try again.',
        );
      }
    } while (attempts < maxAttempts);

    // Create new URL record
    const url = this.urlRepository.create({
      originalUrl,
      shortCode,
      alias,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    const savedUrl = await this.urlRepository.save(url);
    return this.mapToResponseDto(savedUrl);
  }

  /**
   * Find URL by short identifier (alias or shortCode)
   */
  async findByShortIdentifier(identifier: string): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: [{ shortCode: identifier }, { alias: identifier }],
      relations: ['analytics'],
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.isExpired) {
      throw new NotFoundException('Short URL has expired');
    }

    return url;
  }

  /**
   * Get URL information without redirecting
   */
  async getUrlInfo(identifier: string): Promise<UrlResponseDto> {
    const url = await this.findByShortIdentifier(identifier);
    return this.mapToResponseDto(url);
  }

  /**
   * Record a click and return the original URL for redirection
   */
  async recordClickAndRedirect(
    identifier: string,
    ipAddress: string,
    userAgent?: string,
    referrer?: string,
  ): Promise<string> {
    const url = await this.findByShortIdentifier(identifier);

    // Record the click in analytics
    const analytics = this.analyticsRepository.create({
      urlId: url.id,
      ipAddress,
      userAgent,
      referrer,
    });

    await this.analyticsRepository.save(analytics);

    // Increment click count
    await this.urlRepository.increment({ id: url.id }, 'clickCount', 1);

    return url.originalUrl;
  }

  /**
   * Delete a short URL
   */
  async deleteUrl(identifier: string): Promise<void> {
    const url = await this.findByShortIdentifier(identifier);
    await this.urlRepository.remove(url);
  }

  /**
   * Get all URLs (for admin/debugging purposes)
   */
  async getAllUrls(): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.find({
      order: { createdAt: 'DESC' },
    });

    return urls.map((url) => this.mapToResponseDto(url));
  }

  /**
   * Generate a random short code
   */
  private generateShortCode(): string {
    const length = this.configService.get('SHORT_CODE_LENGTH', 6);
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Map URL entity to response DTO
   */
  private mapToResponseDto(url: Url): UrlResponseDto {
    const baseUrl = this.configService.get('BASE_URL', 'http://localhost:3000');
    const shortIdentifier = url.alias || url.shortCode;

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      alias: url.alias,
      shortUrl: `${baseUrl}/${shortIdentifier}`,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clickCount: url.clickCount,
      isExpired: url.isExpired,
    };
  }
}
