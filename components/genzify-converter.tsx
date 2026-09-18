"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { genzifyText } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  getFingerprint,
  hasReachedLimit,
  incrementRequestCount,
  getRemainingRequests,
  formatTimeUntilReset,
} from "@/utils/usage-tracker"
import { logger } from "@/utils/logger"

const genZTitles = [
  "OK BOOMER, HERE'S UR TRANSLATION",
  "ur gen-zified nonsense, enjoy",
  "slayified 4 the culture 💅😭",
  "THIS? this ate. no crumbs.",
  "translated for those born before wi-fi",
  "ur daily dose of ✨brainrot✨",
  "speaketh likeeth the tiketh toketh youth",
  "help it's giving gen-z 🫠",
  "NO CAP TRANSLATION INCOMING 🔊",
  "🧠💥GEN Z BRAIN ACTIVATED💥🧠",
]

// Local storage keys
const STORAGE_KEY_OUTPUT = "genzify_output_text"
const STORAGE_KEY_SHOW_OUTPUT = "genzify_show_output"
const STORAGE_KEY_TITLE = "genzify_title"
const STORAGE_KEY_INPUT = "genzify_input_text"

export default function GenzifyConverter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [emojiLevel, setEmojiLevel] = useState("on")
  const [isConverting, setIsConverting] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [randomTitle, setRandomTitle] = useState(genZTitles[0])
  const [remainingRequests, setRemainingRequests] = useState(10)
  const [timeUntilReset, setTimeUntilReset] = useState("12h 0m")
  const [fingerprint, setFingerprint] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved state from localStorage on component mount
  useEffect(() => {
    if (!isClient) return

    try {
      // Load saved state
      const savedOutput = localStorage.getItem(STORAGE_KEY_OUTPUT)
      const savedShowOutput = localStorage.getItem(STORAGE_KEY_SHOW_OUTPUT)
      const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE)
      const savedInput = localStorage.getItem(STORAGE_KEY_INPUT)

      if (savedOutput) setOutputText(savedOutput)
      if (savedShowOutput === "true") setShowOutput(true)
      if (savedTitle) setRandomTitle(savedTitle)
      if (savedInput) setInputText(savedInput)

      // Initialize fingerprint
      const fp = getFingerprint()
      setFingerprint(fp)

      // Update usage info
      updateUsageInfo()
    } catch (error) {
      logger.error("Error initializing:", error)
    }

    // Update the countdown timer every minute
    const intervalId = setInterval(() => {
      updateUsageInfo()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [isClient])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return

    try {
      if (outputText) {
        localStorage.setItem(STORAGE_KEY_OUTPUT, outputText)
      }

      localStorage.setItem(STORAGE_KEY_SHOW_OUTPUT, String(showOutput))

      if (randomTitle) {
        localStorage.setItem(STORAGE_KEY_TITLE, randomTitle)
      }

      if (inputText) {
        localStorage.setItem(STORAGE_KEY_INPUT, inputText)
      }
    } catch (error) {
      logger.error("Error saving state:", error)
    }
  }, [outputText, showOutput, randomTitle, inputText, isClient])

  // Update usage information
  const updateUsageInfo = useCallback(() => {
    if (!isClient) return

    try {
      const remaining = getRemainingRequests()
      const resetTime = formatTimeUntilReset()
      setRemainingRequests(remaining)
      setTimeUntilReset(resetTime)
    } catch (error) {
      logger.error("Error updating usage info:", error)
    }
  }, [isClient])

  const handleConvert = useCallback(async () => {
    if (!isClient) return

    if (!inputText.trim()) {
      toast({
        title: "bruh... 💀",
        description: "u gotta type smth first, no cap fr fr",
        variant: "destructive",
      })
      return
    }

    // Check if user has reached their limit
    if (hasReachedLimit()) {
      toast({
        title: "limit reached bestie 🙅‍♀️",
        description: `try again in ${timeUntilReset}`,
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Log the input text for user reference
    logger.user("Original Text:", inputText)

    try {
      // Increment request count before making the API call
      incrementRequestCount()

      // Update UI to reflect the new count
      updateUsageInfo()

      const result = await genzifyText(inputText, emojiLevel, fingerprint)

      if (!result.ok) {
        toast({
          title: result.code === "service_unavailable" ? "the converter needs a refill" : "yikes... that's so cringe",
          description: result.message,
          variant: "destructive",
        })
        return
      }

      // Log the output translation for user reference
      logger.user("Gen-Z Translation:", result.text)

      // Set output text and save to localStorage
      setOutputText(result.text)
      localStorage.setItem(STORAGE_KEY_OUTPUT, result.text)

      // Set random title and save to localStorage
      const newTitle = genZTitles[Math.floor(Math.random() * genZTitles.length)]
      setRandomTitle(newTitle)
      localStorage.setItem(STORAGE_KEY_TITLE, newTitle)

      // Force showing the output screen and save to localStorage
      setShowOutput(true)
      localStorage.setItem(STORAGE_KEY_SHOW_OUTPUT, "true")
    } catch (error) {
      logger.error("Error in conversion:", error)
      const safeMessage = "we couldn't convert that text rn. try again in a sec."

      toast({
        title: "yikes... that's so cringe",
        description: safeMessage,
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }, [inputText, emojiLevel, fingerprint, timeUntilReset, toast, updateUsageInfo, isClient])

  const handleReset = useCallback(() => {
    if (!isClient) return

    setShowOutput(false)
    localStorage.setItem(STORAGE_KEY_SHOW_OUTPUT, "false")

    setInputText("")
    localStorage.removeItem(STORAGE_KEY_INPUT)

    setOutputText("")
    localStorage.removeItem(STORAGE_KEY_OUTPUT)

    localStorage.removeItem(STORAGE_KEY_TITLE)
  }, [isClient])

  return (
    <div className="space-y-6">
      {!showOutput ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="input-text" className="text-white text-lg font-bold flex items-center">
              <span className="animate-bounce mr-1">👉</span>
              input ur boring text here
            </Label>
            <Textarea
              id="input-text"
              placeholder="type ur basic text here..."
              className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-lg font-bold">emoji vibe check</Label>
            <RadioGroup
              defaultValue="on"
              value={emojiLevel}
              onValueChange={setEmojiLevel}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg border border-white/20 hover:bg-white/20 transition">
                <RadioGroupItem value="off" id="emoji-off" />
                <Label htmlFor="emoji-off" className="text-white cursor-pointer">
                  OFF
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg border border-white/20 hover:bg-white/20 transition">
                <RadioGroupItem value="on" id="emoji-on" />
                <Label htmlFor="emoji-on" className="text-white cursor-pointer">
                  ON 😎
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg border border-white/20 hover:bg-white/20 transition">
                <RadioGroupItem value="insane" id="emoji-insane" />
                <Label htmlFor="emoji-insane" className="text-white cursor-pointer animate-pulse">
                  INSANE!!! 🔥💯🤪
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleConvert}
            disabled={isConverting || (isClient && hasReachedLimit())}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-4 text-lg hover:animate-pulse transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                loading...
              </>
            ) : isClient && hasReachedLimit() ? (
              <>quota reached bestie 😭</>
            ) : (
              <>gEn-Z-iFy!!1! 🤪</>
            )}
          </Button>

          {isClient && hasReachedLimit() && (
            <div className="text-center text-white/80 text-sm animate-pulse">
              come back in {timeUntilReset} for more brain rot
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output-text" className="text-white text-lg font-bold flex items-center">
                <span className="animate-pulse mr-1">✨</span>
                {randomTitle}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-white border-white/20 bg-white/10 hover:bg-white/20"
              >
                reset
              </Button>
            </div>
            <div className="relative">
              <Textarea
                id="output-text"
                readOnly
                className="min-h-[200px] bg-white/10 border-white/20 text-white font-medium"
                value={outputText || "No output received. Please try again."}
              />
              <Button
                onClick={() => {
                  if (isClient) {
                    navigator.clipboard.writeText(outputText)
                    toast({
                      title: "yurrr",
                      description: "copied to clipboard, bestie",
                    })
                  }
                }}
                className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/40"
                size="sm"
                disabled={!outputText || !isClient}
              >
                copy
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {/* Usage Quota Indicator */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <span className="font-bold">Slay cap:</span> {remainingRequests} left
                </div>
                <div className="text-white/70 text-sm">Resets in: {timeUntilReset}</div>
              </div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(remainingRequests / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
