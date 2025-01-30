"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { label: 'Store', href: '/store' },
    { label: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <nav className="w-full border-b bg-white">
      <div className="w-full px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 relative -mb-8">
            <div className="flex items-center relative">
              <img 
                src="logo.svg" 
                alt="Axolhost" 
                className="h-24"
              />
              <div className="absolute left-24 transform -translate-y-4"> {/* Changed to absolute positioning */}
                <span className="text-xl font-bold">Axolhost</span>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
            <UserButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile menu dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-16 w-full bg-white border-b md:hidden">
              <div className="flex flex-col space-y-1 px-4 py-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;