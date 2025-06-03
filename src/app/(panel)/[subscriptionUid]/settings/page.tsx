type Params = {
  subscriptionUid: string;
}

export default async function Settings({ params }: { params: Promise<Params> }) {
    const { subscriptionUid } = await params;

  return (
    <main className="flex-1">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
          {subscriptionUid}
        </h1>
    </main>
  )
}