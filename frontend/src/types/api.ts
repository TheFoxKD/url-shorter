// API Request types
export interface CreateUrlRequest {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}

// API Response types
export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias?: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  clickCount: number;
  isExpired: boolean;
}

export interface ClickAnalytics {
  ipAddress: string;
  clickedAt: string;
  countryCode?: string;
  referrer?: string;
}

export interface AnalyticsResponse {
  url: {
    id: string;
    originalUrl: string;
    shortCode: string;
    alias?: string;
    createdAt: string;
  };
  totalClicks: number;
  uniqueClicks: number;
  recentClicks: ClickAnalytics[];
  dailyStats: Array<{
    date: string;
    clicks: number;
  }>;
  topReferrers: Array<{
    domain: string;
    clicks: number;
  }>;
  topCountries?: Array<{
    country: string;
    clicks: number;
  }>;
}

export interface GlobalStats {
  totalUrls: number;
  totalClicks: number;
  uniqueVisitors: number;
  topUrls: Array<{
    shortCode: string;
    alias?: string;
    originalUrl: string;
    clicks: number;
  }>;
}

// Error response type
export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}
