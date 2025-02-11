import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

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
      <html>
        <head />
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}