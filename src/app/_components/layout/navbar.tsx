"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import ThemeToggle from "@/app/_components/common/ThemeToggle";

interface NavbarItem {
    label: string
    href: string
}

interface NavbarProps {
    items?: NavbarItem[]
    showAuth?: boolean
}

function AxolotlImg() {
    return (
        <img
            src={'/BucketAxolotlLight.webp'}
            alt="axolotl"
            style={{width: '80px', marginTop: '20px'}}
        />
    )
}

const Navbar = ({ items = [], showAuth = false }: NavbarProps) => {
    const { isLoaded, isSignedIn } = useUser()

    const UserButtonWithLoader = () => {
        return (
            <div className="h-8 w-8 flex items-center justify-center">
                {!isLoaded ? <div className="h-8 w-8 rounded-full bg-muted animate-pulse" /> : <UserButton />}
            </div>
        )
    }

    return (
        <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="w-full px-4 md:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        {AxolotlImg()}
                        <span className="text-2xl font-bold text-foreground">Axolhost</span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {isSignedIn ? items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-muted-foreground hover:text-accent px-3 py-2 text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        )) : []}
                        <ThemeToggle />
                        {showAuth && isLoaded && (
                            <>
                                {isSignedIn ? (
                                    <UserButtonWithLoader />
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <SignInButton mode="modal">
                                            <Button variant="outline" size="sm">
                                                Sign In
                                            </Button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <Button size="sm" className="bg-accent hover:bg-accent/90">
                                                Get Started
                                            </Button>
                                        </SignUpButton>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        {showAuth && isLoaded && isSignedIn && <UserButtonWithLoader />}
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="absolute right-0 mt-4 w-48 bg-background rounded-lg shadow-lg border border-border z-50">
                                <div className="flex flex-col py-2">
                                    {items.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    {showAuth && isLoaded && !isSignedIn && (
                                        <>
                                            <div className="border-t border-border my-2" />
                                            <div className="px-4 py-2 space-y-2">
                                                <SignInButton mode="modal">
                                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                                        Sign In
                                                    </Button>
                                                </SignInButton>
                                                <SignUpButton mode="modal">
                                                    <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                                                        Get Started
                                                    </Button>
                                                </SignUpButton>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
