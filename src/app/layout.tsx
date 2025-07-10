import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'
import {ThemeProvider} from "next-themes";
import {STORE_PATH} from "@/app/constants";

export const metadata: Metadata = {
  title: {
    template: '%s | Axolhost',
    default: 'Axolhost',
  },
  icons: {
    icon: '/BucketAxolotlLight.webp'
  },
  description: "Minecraft Hosting",
}

export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider signInForceRedirectUrl={STORE_PATH} signUpForceRedirectUrl={STORE_PATH}>
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