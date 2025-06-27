import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'
import {ThemeProvider} from "next-themes";

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
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                <main>
                    {children}
                </main>
                <Toaster />
                </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  )
}