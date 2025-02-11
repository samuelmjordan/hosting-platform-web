import Navbar from "@/app/_components/navbar"
import Footer from "../_components/footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Navbar />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <div>
        <Footer />
      </div>
    </div>
  )
}