import {
  IsUrl,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Original URL to be shortened',
    example: 'https://www.example.com/very/long/url/that/needs/shortening',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @Transform(({ value }) => value?.trim())
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the short URL (optional, max 20 characters)',
    example: 'my-custom-link',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Alias must be at least 3 characters long' })
  @MaxLength(20, { message: 'Alias cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Alias can only contain letters, numbers, underscores, and hyphens',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  alias?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the short URL (ISO 8601 format)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid ISO date string' })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    // Ensure the date is in the future
    if (date <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
    return date.toISOString();
  })
  expiresAt?: string;
}
