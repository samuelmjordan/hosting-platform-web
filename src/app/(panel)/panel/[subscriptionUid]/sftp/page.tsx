import SftpPage from "@/app/_components/page/sftp/SftpPage";

type Params = {
    subscriptionUid: string;
}

export default async function Sftp({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;

    return (
        <main className="flex-1 p-6">
            <SftpPage
                subscriptionId={subscriptionUid}
            />
        </main>
    )
}