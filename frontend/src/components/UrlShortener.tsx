import React, { useState } from "react";
import { Link2, Clock, Tag, Loader2 } from "lucide-react";
import { ApiService } from "../services/api";
import { CreateUrlRequest, UrlResponse } from "../types/api";
import { isValidUrl } from "../utils/helpers";

interface UrlShortenerProps {
  onUrlCreated: (url: UrlResponse) => void;
}

/**
 * Form component for creating shortened URLs
 * Features: URL validation, custom alias, expiry date, loading states
 */
export const UrlShortener: React.FC<UrlShortenerProps> = ({ onUrlCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: "",
    alias: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL format
    if (!isValidUrl(formData.originalUrl)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)",
      );
      return;
    }

    // Validate alias format if provided
    if (formData.alias && !/^[a-zA-Z0-9-_]+$/.test(formData.alias)) {
      setError(
        "Alias can only contain letters, numbers, hyphens, and underscores",
      );
      return;
    }

    // Validate expiry date if provided
    if (formData.expiresAt) {
      const expiryDate = new Date(formData.expiresAt);
      if (expiryDate <= new Date()) {
        setError("Expiry date must be in the future");
        return;
      }
    }

    setLoading(true);

    try {
      const dto: CreateUrlRequest = {
        originalUrl: formData.originalUrl,
        ...(formData.alias && { alias: formData.alias }),
        ...(formData.expiresAt && { expiresAt: formData.expiresAt }),
      };

      const result = await ApiService.createShortUrl(dto);
      onUrlCreated(result);

      // Reset form after successful creation
      setFormData({ originalUrl: "", alias: "", expiresAt: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(""); // Clear error when user starts typing
    };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Link2 className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Shorten Your URL
          </h2>
          <p className="text-sm text-gray-600">
            Create a short link and customize it
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Original URL input */}
        <div>
          <label
            htmlFor="originalUrl"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Original URL *
          </label>
          <input
            type="url"
            id="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange("originalUrl")}
            placeholder="https://example.com/very-long-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            required
            disabled={loading}
          />
        </div>

        {/* Optional fields in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom alias */}
          <div>
            <label
              htmlFor="alias"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Tag className="w-4 h-4 inline mr-1" />
              Custom Alias (optional)
            </label>
            <input
              type="text"
              id="alias"
              value={formData.alias}
              onChange={handleChange("alias")}
              placeholder="my-custom-link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Letters, numbers, hyphens, and underscores only
            </p>
          </div>

          {/* Expiry date */}
          <div>
            <label
              htmlFor="expiresAt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Expires At (optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange("expiresAt")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !formData.originalUrl}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Shorten URL</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
