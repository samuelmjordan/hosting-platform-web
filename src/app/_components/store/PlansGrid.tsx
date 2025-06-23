import React from 'react';
import { PlanCard } from './PlanCard';
import {CurrencyAmount, Plan, SupportedCurrency} from "@/app/types";

interface PlansGridProps {
    plans: Plan[];
    currency: SupportedCurrency;
    selectedPlan: Plan | null;
    onPlanSelect: (plan: Plan) => void;
    formatCurrency: (amount: CurrencyAmount) => string;
}

export const PlansGrid: React.FC<PlansGridProps> = ({
    plans,
    currency,
    selectedPlan,
    onPlanSelect,
    formatCurrency,
}) => {
    const filteredPlans = plans.filter(plan => plan.price.currency === currency);

    return (
        <section className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                {filteredPlans.map((plan) => (
                    <PlanCard
                        key={`${plan.specification.title}_${plan.price.currency}`}
                        plan={plan}
                        isSelected={selectedPlan?.price.price_id === plan.price.price_id}
                        isPopular={plan.specification.title === "Iron"}
                        onSelect={onPlanSelect}
                        formatCurrency={formatCurrency}
                    />
                ))}
            </div>
        </section>
    );
};