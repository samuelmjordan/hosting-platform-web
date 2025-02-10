import { StoreComponent } from '@/app/_components/store/storeComponent';
import { pricesAPI, regionsAPI } from '@/app/_services/api';

export default async function StorePage() {
  const [products, regions] = await Promise.all([
    pricesAPI.fetchProductPrices({productId: "test"}),
    regionsAPI.fetchProductRegions(),
  ]);

  return <StoreComponent products={products} regions={regions} />;
}