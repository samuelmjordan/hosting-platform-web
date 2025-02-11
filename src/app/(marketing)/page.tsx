import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/store');
  }

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
          <SignUpButton mode="modal">
            <Button size="lg">
              Create Account
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  )
}