import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cva, type VariantProps } from 'class-variance-authority';

const planTierVariants = cva(
    "transition-colors",
    {
        variants: {
            tier: {
                wood: "bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-100 dark:border-orange-800 dark:hover:bg-orange-900",
                stone: "bg-stone-50 text-stone-900 border-stone-200 hover:bg-stone-100 dark:bg-stone-950 dark:text-stone-100 dark:border-stone-800 dark:hover:bg-stone-900",
                iron: "bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-900",
                gold: "bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800 dark:hover:bg-yellow-900",
                diamond: "bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-100 dark:border-cyan-800 dark:hover:bg-cyan-900",
                netherite: "bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-100 dark:border-rose-800 dark:hover:bg-rose-900",
                default: "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
            },
            variant: {
                default: "border",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }
        },
        defaultVariants: {
            tier: "default",
            variant: "default"
        }
    }
);

interface PlanTierBadgeProps extends VariantProps<typeof planTierVariants> {
    specificationTitle: string;
    className?: string;
}

export const PlanTierBadge: React.FC<PlanTierBadgeProps> = ({
    specificationTitle,
    tier,
    variant = "default",
    className
}) => {
    const normalizedTier = (tier || specificationTitle).toLowerCase() as NonNullable<typeof tier>;

    return (
        <Badge
            variant={variant === "default" ? undefined : variant}
            className={planTierVariants({
                tier: normalizedTier,
                variant: variant === "default" ? undefined : variant,
                className
            })}
        >
            {specificationTitle}
        </Badge>
    );
};

export default PlanTierBadge;