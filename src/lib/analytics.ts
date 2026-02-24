import ReactGA from "react-ga4";

/* ================================
   Initialize Google Analytics
================================ */

export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (measurementId) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        debug_mode: import.meta.env.DEV, // Debug only in development
      },
    });
  }
};

/* ================================
   Track Page View
================================ */

export const trackPageView = (path: string, title?: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: title || document.title,
  });
};

/* ================================
   Generic Event Tracking
================================ */

export function trackEvent(
  name: string,
  params?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  // gtag method (fallback)
  window.gtag?.("event", name, params);
  
  // react-ga4 method (preferred)
  ReactGA.event(name, params);
}

/* ================================
   Device & Browser Info
================================ */

export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Detect device type
  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
  if (/Mobile|Android|iPhone/i.test(ua)) deviceType = "mobile";
  else if (/iPad|Tablet/i.test(ua)) deviceType = "tablet";
  
  // Detect OS
  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  
  // Detect browser
  let browser = "Unknown";
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Edge/i.test(ua)) browser = "Edge";
  
  return {
    deviceType,
    os,
    browser,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  };
};

/* ================================
   Traffic Source Detection
================================ */

export const getTrafficSource = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // UTM parameters
  const source = urlParams.get("utm_source") || "direct";
  const medium = urlParams.get("utm_medium") || "none";
  const campaign = urlParams.get("utm_campaign") || "none";
  
  // Referrer
  const referrer = document.referrer;
  let referrerDomain = "direct";
  
  if (referrer) {
    try {
      referrerDomain = new URL(referrer).hostname;
    } catch (e) {
      referrerDomain = "unknown";
    }
  }
  
  // Detect TikTok specifically
  const isTikTok = 
    referrer.includes("tiktok.com") || 
    source.toLowerCase().includes("tiktok");
  
  return {
    source: isTikTok ? "tiktok" : source,
    medium,
    campaign,
    referrer: referrerDomain,
    isTikTok,
  };
};

/* ================================
   Session Info
================================ */

let sessionStartTime: number | null = null;

export const startSession = () => {
  sessionStartTime = Date.now();
  
  const deviceInfo = getDeviceInfo();
  const trafficInfo = getTrafficSource();
  
  trackEvent("session_start", {
    ...deviceInfo,
    ...trafficInfo,
  });
};

export const getSessionDuration = (): number => {
  if (!sessionStartTime) return 0;
  return Math.floor((Date.now() - sessionStartTime) / 1000); // seconds
};