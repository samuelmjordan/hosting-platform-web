import { Plan, SpecificationType } from "@/app/types";

export async function fetchPlans(specificationType: SpecificationType): Promise<Plan[]> {
  const response = await fetch(`${process.env.API_URL}/api/plan/${specificationType}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Plans not found for this type');
    }
    throw new Error('Failed to fetch plans');
  }

  return response.json();
}