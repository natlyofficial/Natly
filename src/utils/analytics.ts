export function trackEvent(
  name: string,
  params?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, params);
}
