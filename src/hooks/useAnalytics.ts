import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, getSessionDuration } from "../lib/analytics";
import { trackPageDropOff, trackScrollDepth, trackTimeOnPage } from "../lib/analyticsEvents";

/* ================================
   Hook: Auto-track page views
================================ */

export function usePageTracking() {
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);

  // Track page view on route change
  useEffect(() => {
    trackPageView(location.pathname);
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
  }, [location.pathname]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = Math.round((scrolled / scrollHeight) * 100);

      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
        trackScrollDepth(depth);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track time on page when leaving
  useEffect(() => {
    return () => {
      const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);
      
      trackTimeOnPage({
        page: location.pathname,
        timeSpent,
      });

      // Track drop-off if user leaves quickly
      if (timeSpent < 5) {
        trackPageDropOff({
          page: location.pathname,
          timeSpent,
          scrollDepth: maxScrollDepth.current,
        });
      }
    };
  }, [location.pathname]);
}

/* ================================
   Hook: Track quiz session
================================ */

export function useQuizTracking() {
  const questionStartTime = useRef<number>(Date.now());

  const startQuestion = () => {
    questionStartTime.current = Date.now();
  };

  const getQuestionTime = (): number => {
    return Math.floor((Date.now() - questionStartTime.current) / 1000);
  };

  return {
    startQuestion,
    getQuestionTime,
  };
}

/* ================================
   Hook: Track session duration
================================ */

export function useSessionTracking() {
  useEffect(() => {
    // Track when user closes tab/window
    const handleBeforeUnload = () => {
      const sessionDuration = getSessionDuration();
      
      // Use sendBeacon for guaranteed delivery
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append("session_duration", sessionDuration.toString());
        navigator.sendBeacon("/api/analytics/session", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}