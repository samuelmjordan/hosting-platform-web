import Navbar from "@/app/_components/layout/navbar"
import Footer from "../_components/layout/footer"
import {BILLING_PATH, STORE_PATH} from "@/app/constants";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const menuItems = [
    { label: 'Shop', href: STORE_PATH },
    { label: 'Dashboard', href: '/user/dashboard' },
    { label: 'Billing', href: BILLING_PATH }
  ];

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar items={menuItems} showAuth={true} />
            {children}
            <Footer />
        </div>)
}