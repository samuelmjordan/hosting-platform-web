import Navbar from "@/app/_components/layout/navbar"
import Footer from "../_components/layout/footer"
import { CORE_ITEMS } from "@/app/constants";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar items={CORE_ITEMS} showAuth={true} />
            {children}
            <Footer />
        </div>)
}