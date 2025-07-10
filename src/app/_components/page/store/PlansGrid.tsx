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
    return (
        <section className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <PlanCard
                        key={`${plan.specification.title}_${currency}`}
                        plan={plan}
                        isSelected={selectedPlan?.price.price_id === plan.price.price_id}
                        isPopular={plan.specification.title === "Gold"}
                        onSelect={onPlanSelect}
                        formatCurrency={formatCurrency}
                        currency={currency}
                    />
                ))}
            </div>
        </section>
    );
};