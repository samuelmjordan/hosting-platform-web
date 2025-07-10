import Navbar from "@/app/_components/layout/navbar"
import Footer from "@/app/_components/layout/footer"
import type React from "react";
import {CORE_ITEMS} from "@/app/constants";

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar items={CORE_ITEMS} showAuth={true} />
            {children}
            <Footer />
        </div>)
}