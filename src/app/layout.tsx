import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Suspense } from "react"

export const metadata: Metadata = {
  title: {
    template: '%s | Your Brand',
    default: 'Your Brand',
  },
  description: "Modern web application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body className="m-0">
          <Suspense fallback={null}>
            <SpeedInsights />
            {children}
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  )
}