"use client";

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { NavbarItem } from '../types';

interface NavbarProps {
    items: NavbarItem[]
}

const Navbar = ({ items }: NavbarProps) => {
    const { isLoaded } = useUser();

    const UserButtonWithLoader = () => {
        if (!isLoaded) {
            return (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            );
        }
        return <UserButton />;
    };

    return (
        <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
            <div className="w-full px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 relative -mb-8">
                        <div className="flex items-center relative">
                            <img
                                src="/logo.svg"
                                alt="Axolhost"
                                className="h-24"
                            />
                            <div className="absolute left-24 transform -translate-y-4">
                                <span className="text-xl font-bold text-foreground">Axolhost</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:space-x-8">
                        {items.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                        <UserButtonWithLoader />
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="absolute right-0 mt-4 w-48 bg-background rounded-lg shadow-lg border border-border z-50">
                                <div className="flex flex-col py-2">
                                    {items.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        <UserButtonWithLoader />
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;