import BackupsPage from "@/app/_components/page/backups/BackupsPage";

type Params = {
    subscriptionUid: string;
}

export default async function Backups({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;

    return (
        <main className="flex-1 p-6">
            <BackupsPage
                subscriptionId={subscriptionUid}
            />
        </main>
    )
}