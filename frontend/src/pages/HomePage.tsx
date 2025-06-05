import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UrlShortener } from "../components/UrlShortener";
import { UrlList } from "../components/UrlList";
// import { ApiService } from '../services/api'; // TODO: Use for loading user URLs
import { UrlResponse } from "../types/api";

/**
 * Main homepage component
 * Features: URL creation form and list of existing URLs
 */
export const HomePage: React.FC = () => {
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user's URLs on component mount
  useEffect(() => {
    loadUrls();
  }, []);

  // Function to load URLs from API
  const loadUrls = async () => {
    try {
      setLoading(true);
      // Note: In a real app, this would be a user-specific endpoint
      // For now, we'll load some sample URLs or handle this differently
      const mockUrls: UrlResponse[] = [];
      setUrls(mockUrls);
    } catch (error) {
      console.error("Failed to load URLs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new URL creation
  const handleUrlCreated = (newUrl: UrlResponse) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  // Handle URL deletion
  const handleUrlDeleted = (deletedId: string) => {
    setUrls((prev) => prev.filter((url) => url.id !== deletedId));
  };

  // Handle analytics navigation
  const handleAnalytics = (identifier: string) => {
    navigate(`/analytics/${identifier}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shorten Your URLs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create short, memorable links and track their performance with
              detailed analytics. Perfect for social media, marketing campaigns,
              and professional use.
            </p>
          </div>

          {/* URL Shortener Form */}
          <div className="max-w-2xl mx-auto">
            <UrlShortener onUrlCreated={handleUrlCreated} />
          </div>

          {/* Success Message */}
          {urls.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-800 font-medium">
                    Great! Your URL has been shortened successfully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* URL List */}
          {urls.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <UrlList
                urls={urls}
                loading={loading}
                onDelete={handleUrlDeleted}
                onAnalytics={handleAnalytics}
                onRefresh={loadUrls}
              />
            </div>
          )}

          {/* Features Section */}
          {urls.length === 0 && !loading && (
            <div className="max-w-4xl mx-auto mt-16">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose Our URL Shortener?
                </h2>
                <p className="text-gray-600">
                  Powerful features to help you manage and track your links
                  effectively.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Custom Aliases
                  </h3>
                  <p className="text-gray-600">
                    Create memorable, branded short links with custom aliases
                    that reflect your content.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Detailed Analytics
                  </h3>
                  <p className="text-gray-600">
                    Track clicks, analyze visitor geography, and understand your
                    audience with comprehensive analytics.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Expiry Control
                  </h3>
                  <p className="text-gray-600">
                    Set expiration dates for your links to maintain control and
                    security over your shared content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
