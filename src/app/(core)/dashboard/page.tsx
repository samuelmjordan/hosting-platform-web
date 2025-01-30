import { ColumnDef } from "@tanstack/react-table"
import { Server } from "@/app/types"
import { DashboardTable } from "@/app/_components/dahboardTable"
import { Card } from "@/components/ui/card"

export const columns: ColumnDef<Server>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

async function getServers(): Promise<Server[]> {
  return [
    {
      id: BigInt(1),
      title: "myServer",
      status: "pending"
    },
    {
      id: BigInt(2),
      title: "Hypixel",
      status: "processing"
    },
    {
      id: BigInt(3),
      title: "hardcore",
      status: "success"
    }
  ]
}

export default async function Dashboard() {
  const data = await getServers()

  return (
    <div className="container min-h-screen mx-auto sm:py-24">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl mb-6">
          Dashboard
        </h1>
      <Card>
        <DashboardTable columns={columns} data={data}/>
      </Card>
    </div>
  )
}