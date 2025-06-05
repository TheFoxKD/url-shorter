import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { UrlCard } from "./UrlCard";
import { UrlResponse } from "../types/api";

interface UrlListProps {
  urls: UrlResponse[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onAnalytics?: (identifier: string) => void;
  onRefresh?: () => void;
}

/**
 * Component for displaying and managing a list of URLs
 * Features: Search, filter, sort, pagination
 */
export const UrlList: React.FC<UrlListProps> = ({
  urls,
  loading = false,
  onDelete,
  onAnalytics,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExpired, setFilterExpired] = useState<
    "all" | "active" | "expired"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "clicks">(
    "newest",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterExpired, sortBy]);

  // Filter and sort URLs
  const filteredUrls = urls
    .filter((url) => {
      // Search filter - check both original URL and short code
      const matchesSearch =
        searchTerm === "" ||
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortCode.toLowerCase().includes(searchTerm.toLowerCase());

      // Expiry filter
      const now = new Date();
      const isExpired = url.expiresAt ? new Date(url.expiresAt) < now : false;

      let matchesExpiry = true;
      if (filterExpired === "active") {
        matchesExpiry = !isExpired;
      } else if (filterExpired === "expired") {
        matchesExpiry = isExpired;
      }

      return matchesSearch && matchesExpiry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "clicks":
          return b.clickCount - a.clickCount;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUrls = filteredUrls.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Your Short URLs
            </h2>
            <p className="text-sm text-gray-600">
              {filteredUrls.length} of {urls.length} URLs
            </p>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
              title="Refresh list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Filters and search */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Expiry filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterExpired}
              onChange={(e) =>
                setFilterExpired(e.target.value as "all" | "active" | "expired")
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="all">All URLs</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "oldest" | "clicks")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="clicks">Most Clicked</option>
          </select>
        </div>
      </div>

      {/* URL Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : paginatedUrls.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {paginatedUrls.map((url) => (
            <UrlCard
              key={url.id}
              url={url}
              onDelete={onDelete}
              onAnalytics={onAnalytics}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No URLs found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterExpired !== "all"
                ? "No URLs match your current filters. Try adjusting your search or filters."
                : "You haven't created any short URLs yet. Create your first one above!"}
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredUrls.length)}
              </span>{" "}
              of <span className="font-medium">{filteredUrls.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1,
                )
                .map((page, index, arr) => (
                  <React.Fragment key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === page
                          ? "bg-primary-600 text-white border-primary-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
