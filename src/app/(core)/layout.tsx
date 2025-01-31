import Navbar from "@/app/_components/navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 h-16 bg-background z-50 border-b">
        <Navbar />
      </div>
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}