import Navbar from "@/app/_components/navbar"
import Footer from "../_components/footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const menuItems = [
    { label: 'Store', href: '/store' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Billing', href: '/billing' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Navbar items={menuItems}/>
      </div>
      <div className="flex-1">
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}