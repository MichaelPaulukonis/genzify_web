// Simple logging utility that only logs essential information

// Check if code is running in browser
const isBrowser = typeof window !== "undefined"

// Create a logger object
export const logger = {
  // Debug logs - completely disabled in production
  debug: (...args: any[]) => {
    // Completely disabled - no debug logs in production or development
    return
  },

  // Error logs - only in development or for critical errors
  error: (...args: any[]) => {
    if (isBrowser) {
      console.error(...args)
    }
  },

  // User-facing logs - only for input/output text
  user: (...args: any[]) => {
    if (isBrowser) {
      console.log("%c🧠 GENZIFY LOG:", "color: #ff00ff; font-weight: bold", ...args)
    }
  },
}
