import PterodactylConsole from "@/app/_components/console/PterodactylConsole";

type Params = {
  subscriptionUid: string;
}

export default async function Console({ params }: { params: Promise<Params> }) {
  const { subscriptionUid } = await params;

  return (
    <main className="flex-1 p-4">
      <PterodactylConsole subscriptionUid={subscriptionUid} />
    </main>
  );
}