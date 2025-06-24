import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    ArrowRightLeft,
    AlertTriangle,
    HelpCircle,
    Timer,
    AlertCircle
} from "lucide-react";
import { ProvisioningStatus, ProvisioningStatusInfo } from "@/app/_services/serverDetailsService";

const getProvisioningStatusInfo = (status: ProvisioningStatus): ProvisioningStatusInfo => {
    switch (status) {
        case ProvisioningStatus.READY:
            return {
                label: 'Ready',
                description: 'Server is online and ready to use'
            };
        case ProvisioningStatus.INACTIVE:
            return {
                label: 'Inactive',
                description: 'Server is offline or suspended'
            };
        case ProvisioningStatus.PROVISIONING:
            return {
                label: 'Setting Up',
                description: 'Server is being created and configured'
            };
        case ProvisioningStatus.DESTROYING:
            return {
                label: 'Removing',
                description: 'Server is being deleted'
            };
        case ProvisioningStatus.MIGRATING:
            return {
                label: 'Migrating',
                description: 'Server is being moved to new hardware'
            };
        case ProvisioningStatus.FAILED:
            return {
                label: 'Failed',
                description: 'Something went wrong - contact support'
            };
        case ProvisioningStatus.PENDING:
            return {
                label: 'Pending',
                description: 'Server request is queued and waiting to start'
            };
        default:
            return {
                label: 'Error',
                description: 'Server encountered an error and needs attention'
            };
    }
};

const getStatusVariant = (status: ProvisioningStatus) => {
    switch (status) {
        case ProvisioningStatus.READY:
            return "default"; // green
        case ProvisioningStatus.PROVISIONING:
        case ProvisioningStatus.MIGRATING:
        case ProvisioningStatus.PENDING:
            return "secondary"; // yellow/amber
        case ProvisioningStatus.INACTIVE:
        case ProvisioningStatus.DESTROYING:
        case ProvisioningStatus.FAILED:
        case ProvisioningStatus.ERROR:
            return "destructive"; // red
        default:
            return "outline"; // neutral
    }
};

const getStatusIcon = (status: ProvisioningStatus) => {
    const iconProps = { className: "w-3 h-3 mr-1" };

    switch (status) {
        case ProvisioningStatus.READY:
            return <CheckCircle {...iconProps} />;
        case ProvisioningStatus.INACTIVE:
            return <XCircle {...iconProps} />;
        case ProvisioningStatus.PROVISIONING:
            return <Clock {...iconProps} />;
        case ProvisioningStatus.DESTROYING:
            return <Trash2 {...iconProps} />;
        case ProvisioningStatus.MIGRATING:
            return <ArrowRightLeft {...iconProps} />;
        case ProvisioningStatus.FAILED:
            return <AlertTriangle {...iconProps} />;
        case ProvisioningStatus.PENDING:
            return <Timer {...iconProps} />;
        case ProvisioningStatus.ERROR:
            return <AlertCircle {...iconProps} />;
        default:
            return <HelpCircle {...iconProps} />;
    }
};

interface ProvisioningStatusBadgeProps {
    status: ProvisioningStatus;
}

export const ProvisioningStatusBadge = ({ status }: ProvisioningStatusBadgeProps) => {
    const statusInfo = getProvisioningStatusInfo(status);
    const variant = getStatusVariant(status);
    const icon = getStatusIcon(status);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant={variant} className="inline-flex items-center">
                        {icon}
                        {statusInfo.label}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{statusInfo.description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};