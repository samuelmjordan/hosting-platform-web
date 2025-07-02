import ServerSettings from "@/app/_components/page/settings/ServerSettings";
import {fetchEggs} from "@/app/_services/public/eggService";

type Params = {
  subscriptionUid: string;
}

export default async function Settings({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;
    const eggs = await fetchEggs();

  return (
    <main className="flex-1">
        <ServerSettings
            eggs={eggs}
            subscriptionId={subscriptionUid}
        />
    </main>
  )
}