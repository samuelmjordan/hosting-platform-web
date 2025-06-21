import { auth } from "@clerk/nextjs/server";
import BackupsPage from "@/app/_components/backups/BackupsPage";

type Params = {
    subscriptionUid: string;
}

export default async function Backups({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;

    const { userId } = await auth();

    return (
        <main className="flex-1 p-6">
            <BackupsPage
                userId={userId || "null"}
                subscriptionId={subscriptionUid}
            />
        </main>
    )
}