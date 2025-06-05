import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  Trash2,
  BarChart3,
  Clock,
  User,
  Check,
} from "lucide-react";
import { UrlResponse } from "../types/api";
import { formatDate, truncateText, copyToClipboard } from "../utils/helpers";
import { ApiService } from "../services/api";

interface UrlCardProps {
  url: UrlResponse;
  onDelete?: (id: string) => void;
  onAnalytics?: (identifier: string) => void;
}

/**
 * Card component for displaying URL information
 * Features: Copy link, delete, view analytics, expiry info
 */
export const UrlCard: React.FC<UrlCardProps> = ({
  url,
  onDelete,
  onAnalytics,
}) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get the full short URL for display and copying
  const shortUrl = `${window.location.origin}/${url.shortCode}`;

  // Handle copy to clipboard with feedback
  const handleCopy = async () => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle URL deletion with confirmation
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) {
      return;
    }

    setDeleting(true);
    try {
      await ApiService.deleteUrl(url.shortCode);
      onDelete?.(url.id);
    } catch (error) {
      console.error("Failed to delete URL:", error);
      alert("Failed to delete URL. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle analytics view
  const handleAnalytics = () => {
    onAnalytics?.(url.shortCode);
  };

  // Check if URL is expired
  const isExpired = url.expiresAt
    ? new Date(url.expiresAt) < new Date()
    : false;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border p-6 transition-all hover:shadow-lg ${
        isExpired ? "border-red-200 bg-red-50" : "border-gray-200"
      }`}
    >
      {/* Header with original URL */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {truncateText(url.originalUrl, 50)}
          </h3>
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary-600 flex items-center space-x-1"
          >
            <span>{truncateText(url.originalUrl, 60)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Expiry warning */}
        {isExpired && (
          <div className="ml-4 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            Expired
          </div>
        )}
      </div>

      {/* Short URL display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short URL
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
            <span className="text-sm font-mono text-gray-900">{shortUrl}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-md border transition-colors ${
              copied
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-white border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* URL metadata */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>{url.clickCount} clicks</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Created {formatDate(url.createdAt)}</span>
        </div>
      </div>

      {/* Expiry information */}
      {url.expiresAt && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {isExpired ? "Expired" : "Expires"} on {formatDate(url.expiresAt)}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAnalytics}
            className="btn-secondary text-sm flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Visit link button */}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit</span>
          </a>

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete URL"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
