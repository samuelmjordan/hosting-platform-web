import StoreComponent from "@/app/_components/storeComponent/storeComponent"
import { Card } from "@/components/ui/card"

export default function Store() {
  return (
    <div className="container min-h-screen mx-auto sm:py-24">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl mb-6">
          Store
        </h1>
      <Card>
        <StoreComponent />
      </Card>
    </div>
  )
}