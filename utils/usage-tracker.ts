// Simple encryption function for tamper resistance
function encrypt(data: string): string {
  // Basic XOR encryption with a fixed key
  const key = "genzify-secret-key"
  return Array.from(data)
    .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join("")
}

// Decrypt the encrypted data
function decrypt(encrypted: string): string {
  // XOR is symmetric, so we can use the same function
  return encrypt(encrypted)
}

// Check if code is running in browser
const isBrowser = typeof window !== "undefined"

// Generate a simple fingerprint
export function generateFingerprint(): string {
  if (!isBrowser) {
    return "server_fingerprint"
  }

  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || "",
      navigator.deviceMemory || "",
      navigator.platform || "",
    ]

    // Create a hash from the components
    let hash = 0
    const str = components.join("###")
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }

    return "fp_" + Math.abs(hash).toString(36)
  } catch (error) {
    return "fp_fallback"
  }
}

// Usage tracking interface
interface UsageData {
  fingerprint: string
  requestCount: number
  periodStart: number
  requestLimit: number
}

// Default usage data
const DEFAULT_USAGE_DATA: UsageData = {
  fingerprint: "",
  requestCount: 0,
  periodStart: Date.now(),
  requestLimit: 10,
}

// Fallback limit when localStorage is unavailable
const FALLBACK_LIMIT = 3

// Period duration in milliseconds (12 hours)
const PERIOD_DURATION = 12 * 60 * 60 * 1000

// Storage key
const STORAGE_KEY = "genzify_usage_data"

// Get usage data from localStorage
export function getUsageData(): UsageData {
  if (!isBrowser) {
    return { ...DEFAULT_USAGE_DATA, requestLimit: FALLBACK_LIMIT }
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (storedData) {
      const decrypted = decrypt(storedData)
      return JSON.parse(decrypted)
    }

    // No stored data, initialize with default
    const fingerprint = generateFingerprint()
    const newData = { ...DEFAULT_USAGE_DATA, fingerprint }
    saveUsageData(newData)
    return newData
  } catch (error) {
    // Return a temporary object with fallback limit
    return {
      fingerprint: generateFingerprint(),
      requestCount: 0,
      periodStart: Date.now(),
      requestLimit: FALLBACK_LIMIT,
    }
  }
}

// Save usage data to localStorage
export function saveUsageData(data: UsageData): void {
  if (!isBrowser) return

  try {
    const encrypted = encrypt(JSON.stringify(data))
    localStorage.setItem(STORAGE_KEY, encrypted)
  } catch (error) {
    // Silent fail
  }
}

// Check if the user has reached their limit
export function hasReachedLimit(): boolean {
  if (!isBrowser) return false

  const data = getUsageData()

  // Check if the period has expired
  if (Date.now() - data.periodStart > PERIOD_DURATION) {
    // Reset for new period
    resetUsagePeriod()
    return false
  }

  return data.requestCount >= data.requestLimit
}

// Increment the request count
export function incrementRequestCount(): void {
  if (!isBrowser) return

  const data = getUsageData()

  // Check if the period has expired
  if (Date.now() - data.periodStart > PERIOD_DURATION) {
    resetUsagePeriod()
    return
  }

  data.requestCount += 1
  saveUsageData(data)
}

// Reset the usage period
export function resetUsagePeriod(): void {
  if (!isBrowser) return

  const data = getUsageData()
  data.requestCount = 0
  data.periodStart = Date.now()
  saveUsageData(data)
}

// Get remaining requests
export function getRemainingRequests(): number {
  if (!isBrowser) return 10

  const data = getUsageData()

  // Check if the period has expired
  if (Date.now() - data.periodStart > PERIOD_DURATION) {
    resetUsagePeriod()
    return data.requestLimit
  }

  return Math.max(0, data.requestLimit - data.requestCount)
}

// Get time until reset (in milliseconds)
export function getTimeUntilReset(): number {
  if (!isBrowser) return PERIOD_DURATION

  const data = getUsageData()
  const elapsed = Date.now() - data.periodStart
  return Math.max(0, PERIOD_DURATION - elapsed)
}

// Format time until reset in a human-readable format
export function formatTimeUntilReset(): string {
  if (!isBrowser) return "12h 0m"

  const ms = getTimeUntilReset()
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}

// Get the fingerprint
export function getFingerprint(): string {
  if (!isBrowser) return "server_fingerprint"

  const data = getUsageData()
  return data.fingerprint
}
