import GenzifyConverter from "@/components/genzify-converter"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 text-white glitch-text animate-pulse">
          <span className="text-shadow-neon">gEnZiFy</span>
          <span className="text-shadow-glitch ml-2">✨</span>
        </h1>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-600 rounded-xl blur opacity-75 -z-10 animate-pulse" />
          <div className="relative bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-xl">
            <GenzifyConverter />
          </div>
        </div>

        <footer className="mt-8 text-center text-white/70 text-sm">
          <p>made with 💀 by <a href="https://michaelpaulukonis.github.io" className="text-cyan-400 underline underline-offset-2 hover:text-white transition-colors">someone</a> who can't even 🙄</p>
        </footer>
      </div>
      <Toaster />
    </main>
  )
}
