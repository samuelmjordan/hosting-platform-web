import Navbar from "@/app/_components/layout/navbar"
import Footer from "@/app/_components/layout/footer"
import type React from "react";

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
    const menuItems = [
        { label: 'Dashboard', href: `/user/dashboard` },
        { label: 'Console', href: `console` },
        { label: 'Files', href: `files` },
        { label: 'SFTP', href: `sftp` },
        { label: 'Backups', href: `backups` },
        { label: 'Settings', href: `settings` }
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar items={menuItems} showAuth={true} />
            {children}
            <Footer />
        </div>)
}