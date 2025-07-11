import { FileExplorer } from '@/app/_components/page/files/FileExplorer';

type Params = {
  subscriptionUid: string;
}

export default async function Files({ params }: { params: Promise<Params> }) {
  const { subscriptionUid } = await params;

  return (
    <main className="flex-1 p-6">
      <FileExplorer
        subscriptionId={subscriptionUid} 
      />
    </main>
  );
}