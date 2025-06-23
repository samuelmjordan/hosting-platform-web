import {auth} from "@clerk/nextjs/server";
import ServerSettings from "@/app/_components/page/settings/ServerSettings";

type Params = {
  subscriptionUid: string;
}

export default async function Settings({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;
    const { userId } = await auth();

  return (
    <main className="flex-1">
        <ServerSettings
            userId={userId || "null"}
            subscriptionId={subscriptionUid}
        />
    </main>
  )
}