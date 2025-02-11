import { StoreComponent } from '@/app/_components/store/storeComponent';
import { regionsAPI } from '@/app/_services/regionApi';
import { pricesAPI, activeProduct } from '@/app/_services/priceApi';

export default async function StorePage() {
  const [prices, regions] = await Promise.all([
    pricesAPI.fetchProductPrices(activeProduct),
    regionsAPI.fetchProductRegions(),
  ]);

  return <StoreComponent prices={prices} regions={regions} />;
}