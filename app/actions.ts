"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { cookies } from "next/headers"

export async function genzifyText(text: string, emojiLevel: string, fingerprint: string): Promise<string> {
  try {
    // Validate fingerprint (simple check for now)
    if (!fingerprint || !fingerprint.startsWith("fp_")) {
      throw new Error("Invalid fingerprint")
    }

    // Store the fingerprint in a cookie for server-side validation
    cookies().set("genzify_fingerprint", fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

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
          "Use an excessive amount of emojis (5-20 per sentence). Go completely overboard with emojis between words and at the end of sentences."
        break
      default:
        emojiInstruction = "Use a moderate amount of emojis (2-4 per sentence)."
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: text,
      system: `You are a Gen Z text converter. Rewrite the input text into chaotic, hyper-online Gen Z slang and syntax. Your goal is to make it sound like it was written by someone deep in TikTok comment culture, Twitter brain-rot, and Discord humor. Emphasize internet-poisoned Gen Z energy.

Rules:
- Use current Gen Z slang such as:
"fr", "no cap", "bestie", "slay", "based", "mid", "delulu", "rizz", "rent free", "main character energy", "ate", "periodt", "it's giving", "bffr", "girl be so for real", "let them cook", "i fear", "me when", "not you ___", "caught in 4k", etc.
- Use stylistic features including:
  - Emphatic reduplication: repeat words for drama (e.g., "slay slay slay", "no bc no bc listen").
  - Shifting word class: turn verbs into nouns, adjectives into verbs, etc. (e.g., "That's a slay," "She rizzed him fr.")
  - Flattened grammar: fragments, missing subjects, abrupt shifts ("me when it's giving delulu but also based??").
- Stylize text with:
  - Random capitalizations ("Be So Fr rn"), letter elongation ("plszzzz"), ironic misspellings ("besti," "feral"), and excessive punctuation ("!!!1!1!! 💀😭").
  - ${emojiInstruction}
  - Optional use of tone indicators (/srs /j /lh).
- Tone should be exaggerated, chaotic, meta, performative, and sometimes sarcastic. Feel free to be dramatic, unhinged, and slightly feral.
- Keep the original meaning, but deliver it like a TikTok voiceover, Tumblr meltdown, or Twitter thread response.
- Only output the converted text—no explanations, no extras.`,
      maxTokens: 1000,
    })

    if (!result.text) {
      throw new Error("Empty response from OpenAI")
    }

    return result.text
  } catch (error) {
    // Rethrow with more details
    throw new Error(`Failed to convert text: ${error instanceof Error ? error.message : String(error)}`)
  }
}
