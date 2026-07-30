// The widget embeds on arbitrary third-party sites (WordPress, Webflow,
// Wix, plain HTML), so these endpoints must be readable cross-origin.
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
