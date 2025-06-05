import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the URL record',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: 'Original URL that was shortened',
    example: 'https://www.example.com/very/long/url',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Short URL identifier',
    example: 'abc123',
  })
  shortCode: string;

  @ApiPropertyOptional({
    description: 'Custom alias if provided',
    example: 'my-link',
  })
  alias?: string;

  @ApiProperty({
    description: 'Complete short URL',
    example: 'http://localhost:3000/abc123',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'Date when the URL was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Expiration date of the short URL',
    example: '2024-12-31T23:59:59.000Z',
  })
  expiresAt?: Date;

  @ApiProperty({
    description: 'Number of times the short URL was clicked',
    example: 42,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Whether the URL has expired',
    example: false,
  })
  isExpired: boolean;
}
