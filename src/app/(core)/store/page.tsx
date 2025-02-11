export const dynamic = 'force-dynamic';

import { StoreComponent } from "@/app/_components/store/storeComponent";
import { fetchPrices } from "@/app/_services/priceService";
import { fetchRegions } from "@/app/_services/regionService";
import { Price, Region } from "@/app/types";

export default async function StorePage() {
  const prices: Price[] = await fetchPrices("prod_RiiVxhDuwyX0qD");
  const regions: Region[] = await fetchRegions();

  return (
  <div>
    <StoreComponent prices={prices} regions={regions} />
  </div>);
}