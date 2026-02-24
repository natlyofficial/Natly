import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePageTracking } from "../hooks/useAnalytics";
import { startSession } from "../lib/analytics";

export default function MainLayout() {
  // Auto-track all page views and engagement
  usePageTracking();
  
  // Start analytics session on mount
  useEffect(() => {
    startSession();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}