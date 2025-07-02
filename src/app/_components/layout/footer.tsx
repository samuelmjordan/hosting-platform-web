import { Server } from "lucide-react"
import Link from "next/link"

const Footer = () => {
    const legalItems = [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "GDPR Compliance", href: "/gdpr" },
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
                            <span className="text-2xl font-bold">Axolhost</span>
                        </div>
                        <p className="text-muted-foreground">Premium Minecraft server hosting for European players.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            {legalItems.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-accent transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; 2025 Musdev. All rights reserved. Made with ❤️ for European Minecraft players.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
