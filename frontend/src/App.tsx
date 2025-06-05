import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { GlobalAnalyticsPage } from "./pages/GlobalAnalyticsPage";

/**
 * Main App component with routing and layout
 * Provides the overall structure and navigation for the URL shortener application
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header with navigation */}
        <Header />

        {/* Main content area */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<GlobalAnalyticsPage />} />
            <Route path="/analytics/:identifier" element={<AnalyticsPage />} />
            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-50">
                  <div className="container-custom py-16">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">
                        404
                      </h1>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Page Not Found
                      </h2>
                      <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a href="/" className="btn-primary">
                        Go Back Home
                      </a>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="container-custom py-8">
            <div className="text-center">
              <p className="text-gray-600">
                Built with ❤️ using React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-sm text-gray-500 mt-2">
                © 2024 URL Shortener. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
