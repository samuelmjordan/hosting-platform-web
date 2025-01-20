import ProductGrid from "@/app/_components/productGrid"

export default function Dashboard() {
  return (
    <main className="flex-1">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-16 mx-auto sm:py-24">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
          Dashboard
        </h1>
        <p className="max-w-3xl mt-6 text-xl text-center text-muted-foreground">
          Your servers...
        </p>
      </div>
    </main>
  )
}