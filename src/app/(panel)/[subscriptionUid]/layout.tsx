import Navbar from "@/app/_components/navbar"
import Footer from "@/app/_components/footer"
import { Params } from "next/dist/server/request/params";
import {Toaster} from "@/components/ui/sonner";

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<Params>; }) {
    const { subscriptionUid } = await params;
    
    const menuItems = [
        { label: 'Dashboard', href: `/dashboard` },
        { label: 'Console', href: `/${subscriptionUid}/console` },
        { label: 'Files', href: `/${subscriptionUid}/files` },
        { label: 'SFTP', href: `/${subscriptionUid}/files` },
        { label: 'Backups', href: `/${subscriptionUid}/backups` },
        { label: 'Settings', href: `/${subscriptionUid}/settings` }
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