import { Button } from "@/components/ui/button"
import Link from "next/link"
import Store from "@/app/_components/store"

export default function Home() {

  return (
    <main className="flex-1">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-16 mx-auto sm:py-24">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
          AxolHost
        </h1>
        <p className="max-w-3xl mt-6 text-xl text-center text-muted-foreground">
          Staright-forward Minecraft Servers.
        </p>
        <div className="flex gap-4 my-10">
          <Button asChild size="lg">
            <Link href="/store">
              Create Account
            </Link>
          </Button>
          <Button variant="outline" size="lg">
          <Link href="/store">
              Log in
            </Link>
          </Button>
        </div>
        <div>
          <Store />
        </div>
      </div>
    </main>
  )
}