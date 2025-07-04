import Navbar from "@/app/_components/layout/navbar"
import Footer from "../_components/layout/footer"
import {STORE_PATH} from "@/app/constants";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const menuItems = [
    { label: 'Shop', href: STORE_PATH },
    { label: 'Dashboard', href: '/user/dashboard' },
    { label: 'Billing', href: 'BILLING_PATH' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar items={menuItems} showAuth={true} />
      <div className="flex-1">
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}