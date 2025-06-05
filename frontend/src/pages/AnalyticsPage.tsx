import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Analytics } from "../components/Analytics";

/**
 * Analytics page component
 * Displays detailed analytics for a specific short URL
 */
export const AnalyticsPage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();

  // Handle case where identifier is not provided
  if (!identifier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Invalid URL
              </h2>
              <p className="text-red-600 mb-4">
                No URL identifier provided for analytics.
              </p>
              <button onClick={() => navigate("/")} className="btn-primary">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to URLs</span>
          </button>
        </div>

        {/* Analytics Component */}
        <Analytics identifier={identifier} />
      </div>
    </div>
  );
};
