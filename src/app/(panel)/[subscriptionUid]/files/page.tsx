import { FileExplorer } from '@/app/_components/files/FileExplorer';
import { auth } from '@clerk/nextjs/server';

type Params = {
  subscriptionUid: string;
}

export default async function Files({ params }: { params: Promise<Params> }) {
  const { subscriptionUid } = await params;
  
  const { userId } = await auth();

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage your server files and configurations
        </p>
      </div>
      
      <FileExplorer 
        userId={userId || "null"} 
        subscriptionId={subscriptionUid} 
      />
    </main>
  );
}