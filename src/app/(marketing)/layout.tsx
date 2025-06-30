import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AxolHost - Premium Minecraft Server Hosting in Europe",
  description:
      "Straightforward, high-performance Minecraft Java Edition server hosting with European data centers, instant setup, and 24/7 support.",
}

export default function MarketingLayout({
                                          children,
                                        }: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white">{children}</div>
}
