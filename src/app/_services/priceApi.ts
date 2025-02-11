import { Price } from '@/app/types';

export const activeProduct: string = "prod_RiiVxhDuwyX0qD";

export const pricesAPI = {
  async fetchProductPrices(productId: string): Promise<Price[]> {
    return [
        { priceId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 10},
        { priceId: "price_1QpeR1LXiVvrT9k7dMUqpywt", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 100},
        { priceId: "price_1QpeQQLXiVvrT9k7GYinS3bk", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 50}
    ];
  }
};