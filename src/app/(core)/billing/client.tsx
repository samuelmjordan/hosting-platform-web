'use client';

import { Server } from "@/app/types";
import { BillingPage } from "@/app/_components/billing/billingTable"

interface BillingClientPageProps {
  initialServers: Server[];
}

export function BillingClientPage({ initialServers }: BillingClientPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <BillingPage />
    </div>
  );
}