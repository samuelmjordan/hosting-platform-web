import Navbar from "@/app/_components/layout/navbar"
import Footer from "@/app/_components/layout/footer"
import { Params } from "next/dist/server/request/params";

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<Params>; }) {
    const { subscriptionUid } = await params;
    
    const menuItems = [
        { label: 'Dashboard', href: `/dashboard` },
        { label: 'Console', href: `/${subscriptionUid}/console` },
        { label: 'Files', href: `/${subscriptionUid}/files` },
        { label: 'SFTP', href: `/${subscriptionUid}/sftp` },
        { label: 'Backups', href: `/${subscriptionUid}/backups` },
        { label: 'Settings', href: `/${subscriptionUid}/settings` }
    ];

    return (
        <div className="flex flex-col min-h-screen">
        <div>
            <Navbar items={menuItems} showAuth={true} />
        </div>
        <div className={`min-h-screen bg-gradient-to-br from-background via-muted/50 to-background`}>
            <div className="container mx-auto p-6 space-y-6">
                {children}
            </div>
        </div>
        <div>
            <Footer />
        </div>
        </div>
    )
}