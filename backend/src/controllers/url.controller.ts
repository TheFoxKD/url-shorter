import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Res,
  Req,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UrlService } from '../services/url.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponseDto } from '../dto/url-response.dto';

@ApiTags('urls')
@Controller()
export class UrlController {
  // Reserved paths that should not be treated as short URLs
  private readonly reservedPaths = [
    'health',
    'api',
    'analytics',
    'urls',
    'info',
    'delete',
    'shorten',
  ];

  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({
    summary: 'Create a short URL',
    description:
      'Creates a shortened version of the provided URL with optional custom alias and expiration date',
  })
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully',
    type: UrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 409,
    description: 'Custom alias already exists',
  })
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<UrlResponseDto> {
    return await this.urlService.createShortUrl(createUrlDto);
  }

  @Get('urls')
  @ApiOperation({
    summary: 'Get all URLs',
    description:
      'Retrieves a list of all shortened URLs (for development/admin purposes)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all URLs',
    type: [UrlResponseDto],
  })
  async getAllUrls(): Promise<UrlResponseDto[]> {
    return await this.urlService.getAllUrls();
  }

  @Get('info/:identifier')
  @ApiOperation({
    summary: 'Get URL information',
    description:
      'Retrieves information about a short URL including click statistics',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Short code or custom alias',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'URL information retrieved successfully',
    type: UrlResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found or expired',
  })
  async getUrlInfo(
    @Param('identifier') identifier: string,
  ): Promise<UrlResponseDto> {
    return await this.urlService.getUrlInfo(identifier);
  }

  @Delete('delete/:identifier')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a short URL',
    description: 'Permanently deletes a short URL and all its analytics data',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Short code or custom alias',
    example: 'abc123',
  })
  @ApiResponse({
    status: 204,
    description: 'URL deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async deleteUrl(@Param('identifier') identifier: string): Promise<void> {
    await this.urlService.deleteUrl(identifier);
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Redirect to original URL',
    description: 'Redirects to the original URL and records analytics data',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Short code or custom alias',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found or expired',
  })
  async redirectToOriginalUrl(
    @Param('identifier') identifier: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    try {
      // Check if the identifier is a reserved path
      if (this.reservedPaths.includes(identifier)) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      // Extract client information
      const ipAddress = this.getClientIpAddress(request);
      const userAgent = request.headers['user-agent'];
      const referrer = request.headers.referer;

      // Record click and get original URL
      const originalUrl = await this.urlService.recordClickAndRedirect(
        identifier,
        ipAddress,
        userAgent,
        referrer,
      );

      // Perform redirect
      response.redirect(HttpStatus.FOUND, originalUrl);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during redirect',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Extract the real client IP address from the request
   */
  private getClientIpAddress(request: Request): string {
    // Check for common proxy headers
    const forwardedFor = request.headers['x-forwarded-for'] as string;
    const realIp = request.headers['x-real-ip'] as string;
    const cfConnectingIp = request.headers['cf-connecting-ip'] as string;

    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, get the first one
      return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
      return realIp;
    }

    if (cfConnectingIp) {
      return cfConnectingIp;
    }

    // Fallback to connection remote address
    return (
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request as any).ip ||
      '127.0.0.1'
    );
  }
}
