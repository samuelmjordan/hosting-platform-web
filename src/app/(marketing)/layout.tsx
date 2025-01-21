import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Brand",
  description: "Modern web application",
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  )
}