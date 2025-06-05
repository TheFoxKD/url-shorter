import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Link,
  Users,
  MousePointer,
  ArrowUpRight,
  Clock,
  BarChart3,
  ExternalLink,
  Eye,
} from "lucide-react";
import { ApiService } from "../services/api";
import { GlobalStats, UrlResponse } from "../types/api";

/**
 * Global analytics component
 * Shows overview statistics and list of all URLs with their analytics
 */
export const GlobalAnalytics: React.FC = () => {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [allUrls, setAllUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  /**
   * Load global statistics and all URLs
   */
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load global stats and all URLs in parallel
      const [statsResponse, urlsResponse] = await Promise.all([
        ApiService.getGlobalStats(),
        ApiService.getAllUrls(),
      ]);

      setGlobalStats(statsResponse);
      // Sort URLs by click count (descending)
      setAllUrls(urlsResponse.sort((a, b) => b.clickCount - a.clickCount));
    } catch (err: any) {
      console.error("Failed to load analytics data:", err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to specific URL analytics
   */
  const viewUrlAnalytics = (identifier: string) => {
    navigate(`/analytics/${identifier}`);
  };

  /**
   * Format URL for display (truncate if too long)
   */
  const formatUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  /**
   * Get display identifier for URL
   */
  const getDisplayIdentifier = (url: UrlResponse) => {
    return url.alias || url.shortCode;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md border p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md border p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadAnalyticsData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Statistics Cards */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total URLs */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total URLs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalStats.totalUrls.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Link className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clicks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalStats.totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Unique Visitors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalStats.uniqueVisitors.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average CTR */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Clicks/URL
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalStats.totalUrls > 0
                    ? (globalStats.totalClicks / globalStats.totalUrls).toFixed(
                        1,
                      )
                    : "0"}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performing URLs */}
      {globalStats && globalStats.topUrls.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Top Performing URLs
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {globalStats.topUrls.map((url, index) => (
              <div
                key={url.shortCode}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => viewUrlAnalytics(url.alias || url.shortCode)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {url.alias || url.shortCode}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatUrl(url.originalUrl)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {url.clicks.toLocaleString()} clicks
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All URLs Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All URLs</h3>
          <p className="text-sm text-gray-500 mt-1">
            Click on any URL to view detailed analytics
          </p>
        </div>

        {allUrls.length === 0 ? (
          <div className="text-center py-12">
            <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No URLs created yet</p>
            <button onClick={() => navigate("/")} className="btn-primary mt-4">
              Create Your First URL
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUrls.map((url) => (
                  <tr
                    key={url.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewUrlAnalytics(getDisplayIdentifier(url))}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-primary-600">
                          {getDisplayIdentifier(url)}
                        </span>
                        {url.alias && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MousePointer className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {url.clickCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          url.isExpired
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {url.isExpired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewUrlAnalytics(getDisplayIdentifier(url));
                          }}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                          title="View Analytics"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-600"
                          title="Open Short URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
