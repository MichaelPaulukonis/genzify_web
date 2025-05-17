"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { genzifyText } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function GenzifyConverter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [emojiLevel, setEmojiLevel] = useState("on")
  const [isConverting, setIsConverting] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const { toast } = useToast()

  async function handleConvert() {
    if (!inputText.trim()) {
      toast({
        title: "bruh... 💀",
        description: "u gotta type smth first, no cap fr fr",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      const result = await genzifyText(inputText, emojiLevel)
      setOutputText(result)
      setShowOutput(true)
    } catch (error) {
      toast({
        title: "yikes... that's so cringe",
        description: "something broke, try again later bestie",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsConverting(false)
    }
  }

  function handleReset() {
    setShowOutput(false)
    setInputText("")
    setOutputText("")
  }

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
            disabled={isConverting}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-4 text-lg hover:animate-pulse transition-all"
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                loading...
              </>
            ) : (
              <>gEn-Z-iFy!!1! 🤪</>
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output-text" className="text-white text-lg font-bold flex items-center">
                <span className="animate-pulse mr-1">✨</span>
                ur gen-z translation
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
                value={outputText}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(outputText)
                  toast({
                    title: "yurrr",
                    description: "copied to clipboard, bestie",
                  })
                }}
                className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/40"
                size="sm"
              >
                copy
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
