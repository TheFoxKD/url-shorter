import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { GlobalAnalytics } from "../components/GlobalAnalytics";

/**
 * Global analytics page component
 * Displays comprehensive analytics dashboard for all URLs
 */
export const GlobalAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Overview of all your shortened URLs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Analytics Component */}
        <GlobalAnalytics />
      </div>
    </div>
  );
};
