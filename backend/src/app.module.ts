import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Url } from './entities/url.entity';
import { Analytics } from './entities/analytics.entity';
import { UrlController } from './controllers/url.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { HealthController } from './controllers/health.controller';
import { UrlService } from './services/url.service';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', 'url_shortener'),
        entities: [Url, Analytics],
        synchronize: configService.get('NODE_ENV') !== 'production', // Auto-sync in development
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),

    // TypeORM feature modules for entities
    TypeOrmModule.forFeature([Url, Analytics]),
  ],
  controllers: [
    AppController,
    HealthController,
    AnalyticsController,
    UrlController,
  ],
  providers: [AppService, UrlService, AnalyticsService],
})
export class AppModule {}
