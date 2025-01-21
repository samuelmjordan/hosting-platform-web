import StoreAccordion from "@/app/_components/store"
import { Card } from "@/components/ui/card"

export default function Store() {
  return (
    <div className="container min-h-screen mx-auto sm:py-24">
      <Card>
        <StoreAccordion />
      </Card>
    </div>
  )
}