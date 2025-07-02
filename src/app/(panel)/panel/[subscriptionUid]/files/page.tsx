import { FileExplorer } from '@/app/_components/page/files/FileExplorer';
import { auth } from '@clerk/nextjs/server';

type Params = {
  subscriptionUid: string;
}

export default async function Files({ params }: { params: Promise<Params> }) {
  const { subscriptionUid } = await params;
  const { userId } = await auth();

  return (
    <main className="flex-1 p-6">
      <FileExplorer 
        userId={userId || "null"} 
        subscriptionId={subscriptionUid} 
      />
    </main>
  );
}