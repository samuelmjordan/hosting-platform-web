import { Server } from "@/app/types"
import { DashboardTable } from "@/app/_components/dahboardTable"
import { Card } from "@/components/ui/card"
import { pricesAPI, regionsAPI, activeProduct } from '@/app/_services/api';

const prices = await pricesAPI.fetchProductPrices(activeProduct);
const regions = await regionsAPI.fetchProductRegions();

async function getServers(): Promise<Server[]> {
  return [
    {
      id: BigInt(1),
      title: "myServer",
      description: "it a good server",
      status: "Offline",
      price: prices.at(0)!,
      region: regions.at(0)!
    },
    {
      id: BigInt(2),
      title: "Hypixel",
      description: "Hunger games lobbies on this server",
      status: "Online",
      price: prices.at(1)!,
      region: regions.at(1)!
    },
    {
      id: BigInt(3),
      title: "hardcore",
      description: "this is a hardcore server",
      status: "Pending",
      price: prices.at(2)!,
      region: regions.at(2)!
    },
    {
      id: BigInt(4),
      title: "SkyBlock",
      description: "Economy-focused skyblock server with custom plugins",
      status: "Online",
      price: prices.at(0)!,
      region: regions.at(1)!
    },
    {
      id: BigInt(5),
      title: "CreativeBuild",
      description: "Creative mode server for builders and artists",
      status: "Online",
      price: prices.at(1)!,
      region: regions.at(2)!
    },
    {
      id: BigInt(6),
      title: "SurvivalPlus",
      description: "Enhanced survival experience with custom mechanics",
      status: "Pending",
      price: prices.at(2)!,
      region: regions.at(0)!
    },
    {
      id: BigInt(7),
      title: "PvPArena",
      description: "Competitive PvP matches and tournaments",
      status: "Online",
      price: prices.at(1)!,
      region: regions.at(1)!
    },
    {
      id: BigInt(8),
      title: "RPGRealm",
      description: "Immersive RPG experience with custom quests",
      status: "Offline",
      price: prices.at(2)!,
      region: regions.at(2)!
    },
    {
      id: BigInt(9),
      title: "MiniGames",
      description: "Collection of various mini-games and party games",
      status: "Online",
      price: prices.at(0)!,
      region: regions.at(0)!
    },
    {
      id: BigInt(10),
      title: "VanillaPlus",
      description: "Slightly enhanced vanilla experience",
      status: "Pending",
      price: prices.at(1)!,
      region: regions.at(1)!
    }
  ]
}

export default async function Dashboard() {
  const servers = await getServers()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl mb-6">
        Dashboard
      </h1>
      <Card className="mt-6">
        <DashboardTable servers={servers}/>
      </Card>
    </div>
  )
}