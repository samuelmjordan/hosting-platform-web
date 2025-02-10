import { StoreComponent } from '@/app/_components/store/storeComponent';
import { pricesAPI, regionsAPI, activeProduct } from '@/app/_services/api';

export default async function StorePage() {
  const [prices, regions] = await Promise.all([
    pricesAPI.fetchProductPrices(activeProduct),
    regionsAPI.fetchProductRegions(),
  ]);

  return <StoreComponent prices={prices} regions={regions} />;
}