import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Eye,
  Globe,
  Calendar,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { ApiService } from "../services/api";
import { AnalyticsResponse } from "../types/api";
import { formatDate } from "../utils/helpers";

interface AnalyticsProps {
  identifier: string;
}

/**
 * Analytics component showing click statistics and trends
 * Features: Click timeline, geographical data, referrer stats
 */
export const Analytics: React.FC<AnalyticsProps> = ({ identifier }) => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await ApiService.getUrlAnalytics(identifier);
        setAnalytics(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [identifier]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <BarChart3 className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Analytics Error
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // Calculate summary statistics
  const totalClicks = analytics.totalClicks;
  const uniqueClicks = analytics.uniqueClicks || analytics.totalClicks; // fallback if uniqueClicks not available
  const clickRate =
    totalClicks > 0 ? ((uniqueClicks / totalClicks) * 100).toFixed(1) : "0";

  // Get top referrers (limit to 5) - handle empty array
  const topReferrers = analytics.topReferrers?.slice(0, 5) || [];

  // Get recent daily stats (last 7 days)
  const recentDays = analytics.dailyStats.slice(-7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-600">
              Statistics for /{identifier}
            </p>
          </div>
        </div>
      </div>

      {/* URL Info */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Original URL</h3>
            <a
              href={analytics.url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 break-all"
            >
              {analytics.url.originalUrl}
            </a>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm font-medium">
              {formatDate(analytics.url.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unique Visitors
              </p>
              <p className="text-2xl font-bold text-gray-900">{uniqueClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Rate</p>
              <p className="text-2xl font-bold text-gray-900">{clickRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Daily Activity (Last 7 Days)
            </h3>
          </div>

          {recentDays.length > 0 ? (
            <div className="space-y-3">
              {recentDays.map((day, index) => {
                const maxClicks = Math.max(
                  ...recentDays.map((d) => d.clicks),
                  1,
                );
                const barWidth =
                  maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0;

                return (
                  <div key={day.date} className="flex items-center space-x-3">
                    <div className="w-16 text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-primary-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-900">
                      {day.clicks}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="mx-auto h-8 w-8 mb-2" />
              <p>No recent activity</p>
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Top Referrers</h3>
          </div>

          {topReferrers.length > 0 ? (
            <div className="space-y-3">
              {topReferrers.map((referrer, index) => {
                const maxClicks = Math.max(
                  ...topReferrers.map((r) => r.clicks),
                  1,
                );
                const barWidth =
                  maxClicks > 0 ? (referrer.clicks / maxClicks) * 100 : 0;

                return (
                  <div key={referrer.domain || index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {referrer.domain === "Direct"
                          ? "Direct visits"
                          : referrer.domain}
                      </span>
                      <span className="text-sm text-gray-600">
                        {referrer.clicks} clicks
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Globe className="mx-auto h-8 w-8 mb-2" />
              <p>No referrer data available</p>
              <p className="text-xs">
                Visits were direct or referrer data not available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Countries Stats - only show if data available */}
      {analytics.topCountries && analytics.topCountries.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Top Countries</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topCountries.slice(0, 6).map((country, index) => (
              <div
                key={country.country}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">
                      {country.country.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {country.country}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{country.clicks}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {analytics.recentClicks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {analytics.recentClicks.slice(0, 10).map((click, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click from {click.countryCode || "Unknown location"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {click.referrer && click.referrer !== "Direct"
                        ? `via ${click.referrer}`
                        : "Direct visit"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(click.clickedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
