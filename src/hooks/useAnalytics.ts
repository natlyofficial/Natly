import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID) return;

    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);

}
