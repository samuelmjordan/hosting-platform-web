import { Plan, Price, Specification } from "@/app/types";
import { fetchPrices } from "@/app/_services/priceService";
import { fetchSpecifications } from "./specificationService";

export async function fetchPlans(productId: string): Promise<Plan[]> {
    const prices: Price[] = await fetchPrices(productId);
    const specifications: Specification[] = await fetchSpecifications();

    return prices
    .map((price) => {
      const spec = specifications.find(spec => spec.specId === price.specId);
      return spec ? { price, spec } : null;
    })
    .filter((pkg): pkg is Plan => pkg !== null);
}