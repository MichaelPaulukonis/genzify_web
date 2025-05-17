"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function genzifyText(text: string, emojiLevel: string): Promise<string> {
  try {
    let emojiInstruction = ""

    switch (emojiLevel) {
      case "off":
        emojiInstruction = "Do not use any emojis."
        break
      case "on":
        emojiInstruction = "Use a moderate amount of emojis (2-4 per sentence)."
        break
      case "insane":
        emojiInstruction =
          "Use an excessive amount of emojis (5-10 per sentence). Go completely overboard with emojis between words and at the end of sentences."
        break
      default:
        emojiInstruction = "Use a moderate amount of emojis (2-4 per sentence)."
    }

    const { text: genzifiedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: text,
      system: `You are a Gen Z text converter. Convert the user's input text into exaggerated Gen Z slang and internet speak.
      
      Rules:
      - Use Gen Z slang like "fr", "no cap", "bestie", "slay", "based", "lowkey", "highkey", "vibing", "sus", "rent free", "living rent free", "main character energy", etc.
      - Add random capitalization, extra letters, and punctuation (!!!1!).
      - Deliberately misspell words and use abbreviations.
      - ${emojiInstruction}
      - Keep the same general meaning as the original text.
      - Make it sound like someone with internet brain-rot wrote it.
      - Keep your response concise and only return the converted text.
      - Do not include any explanations or additional text.`,
      maxTokens: 1000,
    })

    return genzifiedText
  } catch (error) {
    console.error("Error in genzifyText:", error)
    throw new Error("Failed to convert text")
  }
}
