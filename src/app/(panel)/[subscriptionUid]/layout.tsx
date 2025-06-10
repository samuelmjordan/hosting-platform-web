import Navbar from "@/app/_components/navbar"
import Footer from "@/app/_components/footer"
import { Params } from "next/dist/server/request/params";

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<Params>; }) {
    const { subscriptionUid } = await params;
    
    const menuItems = [
        { label: 'Home', href: `/dashboard` },
        { label: 'Console', href: `/${subscriptionUid}/console` },
        { label: 'Files', href: `/${subscriptionUid}/files` },
        { label: 'Settings', href: `/${subscriptionUid}/settings` }
    ];

    return (
        <div className="flex flex-col min-h-screen">
        <div>
            <Navbar items={menuItems}/>
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