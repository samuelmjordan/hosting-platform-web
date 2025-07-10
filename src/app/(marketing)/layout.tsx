import type React from "react"
import Navbar from "@/app/_components/layout/navbar";
import Footer from "@/app/_components/layout/footer";
import {NavbarItem} from "@/app/types";
import {CORE_ITEMS} from "@/app/constants";

const navItems : NavbarItem[] = [
]

export default function MarketingLayout({
    children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
        <Navbar items={CORE_ITEMS} showAuth={true} />
        {children}
        <Footer />
    </div>)
}
