import { Server } from "lucide-react"
import Link from "next/link"

const Footer = () => {
    const footerItems = [
        { label: "Help", href: "/help" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ]

    return (
        <footer className="mt-auto border-t border-border bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <Server className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold">AxolHost</span>
                        </div>
                        <p className="text-muted-foreground">Premium Minecraft server hosting for European players.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="#features" className="hover:text-accent transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-accent transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-accent transition-colors">
                                    Server Locations
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            {footerItems.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-accent transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="#" className="hover:text-accent transition-colors">
                                    Discord
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-accent transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-accent transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-accent transition-colors">
                                    GDPR
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; 2024 AxolHost. All rights reserved. Made with ❤️ for European Minecraft players.
                    </p>
                    <div className="flex items-center mt-4 md:mt-0">
                        <span className="text-muted-foreground text-sm mr-2">Powered by</span>
                        <span className="text-muted-foreground text-sm font-medium">Musdev Limited</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
