import axios, { AxiosResponse } from "axios";
import {
  CreateUrlRequest,
  UrlResponse,
  AnalyticsResponse,
  GlobalStats,
  ApiError,
} from "../types/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// API service class
export class ApiService {
  /**
   * Create a new short URL
   */
  static async createShortUrl(data: CreateUrlRequest): Promise<UrlResponse> {
    try {
      const response: AxiosResponse<UrlResponse> = await api.post(
        "/shorten",
        data,
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all URLs
   */
  static async getAllUrls(): Promise<UrlResponse[]> {
    try {
      const response: AxiosResponse<UrlResponse[]> = await api.get("/urls");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get URL information
   */
  static async getUrlInfo(identifier: string): Promise<UrlResponse> {
    try {
      const response: AxiosResponse<UrlResponse> = await api.get(
        `/info/${identifier}`,
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a URL
   */
  static async deleteUrl(identifier: string): Promise<void> {
    try {
      await api.delete(`/delete/${identifier}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get URL analytics
   */
  static async getUrlAnalytics(identifier: string): Promise<AnalyticsResponse> {
    try {
      const response: AxiosResponse<AnalyticsResponse> = await api.get(
        `/analytics/${identifier}`,
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get global statistics
   */
  static async getGlobalStats(): Promise<GlobalStats> {
    try {
      const response: AxiosResponse<GlobalStats> = await api.get(
        "/analytics/admin/global-stats",
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private static handleError(error: any): Error {
    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      return new Error(apiError.message || "An error occurred");
    }

    if (error.request) {
      return new Error("Network error - please check your connection");
    }

    return new Error(error.message || "An unexpected error occurred");
  }
}

export default ApiService;
