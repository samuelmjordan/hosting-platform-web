"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {
    const [theme, setTheme] = useState("light")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme")
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const initialTheme = savedTheme || systemTheme

        setTheme(initialTheme)
        document.documentElement.classList.toggle("dark", initialTheme === "dark")
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    if (!mounted) {
        return <div className="w-8 h-8" />
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
    )
}

export default ThemeToggle
