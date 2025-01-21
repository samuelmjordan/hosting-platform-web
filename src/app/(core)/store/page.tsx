import StoreComponent from "@/app/_components/storeComponent/storeComponent"
import { Card } from "@/components/ui/card"

export default function Store() {
  return (
    <div className="container min-h-screen mx-auto sm:py-24">
      <Card>
        <StoreComponent />
      </Card>
    </div>
  )
}