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
    icon: '/favicon.ico'
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
        <html lang="en">
            <head>
                <link rel="icon" href="/src/app/favicon.ico" sizes="any" />
                <link rel="icon" href="/BucketAxolotlLight.webp" type="image/webp" />
            </head>
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