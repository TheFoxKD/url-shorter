import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LinkIcon, BarChart3, Home } from "lucide-react";

/**
 * Header component with navigation and branding
 * Uses Tailwind CSS classes for modern styling
 */
export const Header: React.FC = () => {
  const location = useLocation();

  // Check if current path is active for navigation highlighting
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">URL Shortener</h1>
              <p className="text-sm text-gray-500">
                Shorten and track your links
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/analytics")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </nav>

          {/* Mobile menu button (for future implementation) */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600 p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
