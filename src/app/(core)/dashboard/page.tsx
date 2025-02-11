export const dynamic = 'force-dynamic';

import { Server } from "@/app/types"
import { DashboardTable } from "@/app/_components/dashboard/dahboardTable"
import { Card } from "@/components/ui/card"

const prices = [
  { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07a", productId: "3c5f544a-e75b-4a5e-9607-cb65686af07a", specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 10},
  { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07b", productId: "3c5f544a-e75b-4a5e-9607-cb65686af07a", specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 100},
  { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07c", productId: "3c5f544a-e75b-4a5e-9607-cb65686af07a", specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 50}
];
const regions = [
  { id: "3c5f544a-e75b-4a5e-9607-cb65686af07a", continent: "North America", continentCode: "NA", city: "Chicago" },
  { id: "3c5f544a-e75b-4a5e-9607-cb65686af07b", continent: "Western Europe", continentCode: "EUW", city: "Frankfurt" },
  { id: "3c5f544a-e75b-4a5e-9607-cb65686af07c", continent: "Eastern Europe", continentCode: "EUE", city: "Helsinki" },
  { id: "3c5f544a-e75b-4a5e-9607-cb65686af07d", continent: "Southeast Asia", continentCode: "SEA", city: "Singapore" },
];

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
      <Card className="mt-6">
        <DashboardTable servers={servers}/>
      </Card>
    </div>
  )
}