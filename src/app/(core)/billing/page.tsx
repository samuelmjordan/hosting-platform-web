import { fetchServers } from '@/app/_services/serverService';
import { BillingClientPage } from './client';

export default async function BillingPage() {
  const servers = await fetchServers();
  return <BillingClientPage initialServers={servers} />;
}