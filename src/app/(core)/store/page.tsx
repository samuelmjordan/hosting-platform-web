import { StoreComponent } from '@/app/_components/store/storeComponent';
import { pricesAPI, regionsAPI, activeProduct } from '@/app/_services/api';

export default async function StorePage() {
  const [products, regions] = await Promise.all([
    pricesAPI.fetchProductPrices({productId: activeProduct}),
    regionsAPI.fetchProductRegions(),
  ]);

  return <StoreComponent products={products} regions={regions} />;
}