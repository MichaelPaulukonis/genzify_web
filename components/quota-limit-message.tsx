"use client"

import { Button } from "@/components/ui/button"

interface QuotaLimitMessageProps {
  timeUntilReset: string
}

export function QuotaLimitMessage({ timeUntilReset }: QuotaLimitMessageProps) {
  return (
    <div className="text-center p-6 space-y-4">
      <h3 className="text-2xl font-bold text-white">Quota Reached 😭</h3>
      <div className="text-white/80">
        <p>You've used all your Gen-Z translations for now.</p>
        <p className="mt-2">
          Come back in <span className="font-bold">{timeUntilReset}</span> for more brain rot!
        </p>
      </div>
      <div className="pt-4">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    </div>
  )
}
