import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cva, type VariantProps } from 'class-variance-authority';

const statusVariants = cva(
    "transition-colors inline-flex items-center gap-1",
    {
        variants: {
            status: {
                active: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-100 dark:border-green-800 dark:hover:bg-green-900",
                past_due: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800 dark:hover:bg-yellow-900",
                unpaid: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-100 dark:border-red-800 dark:hover:bg-red-900",
                canceled: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-100 dark:border-red-800 dark:hover:bg-red-900",
                default: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
            },
            variant: {
                default: "border",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }
        },
        defaultVariants: {
            status: "default",
            variant: "default"
        }
    }
);

const SUBSCRIPTION_STATUS = {
    active: {
        label: "Active",
        icon: CheckCircle2,
        iconClass: "text-green-500 dark:text-green-400"
    },
    past_due: {
        label: "Payment past due",
        icon: AlertCircle,
        iconClass: "text-yellow-500 dark:text-yellow-400"
    },
    unpaid: {
        label: "Unpaid",
        icon: AlertCircle,
        iconClass: "text-red-500 dark:text-red-400"
    },
    canceled: {
        label: "Canceled",
        icon: XCircle,
        iconClass: "text-red-500 dark:text-red-400"
    }
};

type StatusType = keyof typeof SUBSCRIPTION_STATUS;

interface StatusBadgeProps {
    status?: StatusType | string;
    variant?: VariantProps<typeof statusVariants>['variant'];
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                            status = 'active',
                                                            variant = "default",
                                                            className
                                                        }) => {
    const config = SUBSCRIPTION_STATUS[status as StatusType] || SUBSCRIPTION_STATUS.active;
    const StatusIcon = config.icon;
    const normalizedStatus = (status || 'active') as NonNullable<StatusType>;

    return (
        <Badge
            variant={variant === "default" ? undefined : variant}
            className={statusVariants({
                status: normalizedStatus,
                variant: variant === "default" ? undefined : variant,
                className
            })}
        >
            <StatusIcon className={`h-4 w-4 ${config.iconClass}`} />
            {config.label}
        </Badge>
    );
};

export default StatusBadge;