import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-16 mx-auto sm:py-24">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
          Your Brand
        </h1>
        <p className="max-w-3xl mt-6 text-xl text-center text-muted-foreground">
          A modern platform for building the future. Fast, reliable, and scalable solutions for your business.
        </p>
        <div className="flex gap-4 mt-10">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Create Account
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            Log In
          </Button>
        </div>
      </div>
    </main>
  )
}