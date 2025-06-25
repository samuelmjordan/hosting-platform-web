import { ProvisioningStatus } from "@/app/types";
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

export interface ProvisioningStatusInfo {
    label: string;
    description: string;
}

const getProvisioningStatusInfo = (status: ProvisioningStatus): ProvisioningStatusInfo => {
    switch (status) {
        case ProvisioningStatus.READY:
            return {
                label: 'Ready',
                description: 'Server hardware is ready'
            };
        case ProvisioningStatus.INACTIVE:
            return {
                label: 'Inactive',
                description: 'No server hardware has been provisioned'
            };
        case ProvisioningStatus.PROVISIONING:
            return {
                label: 'Setting Up',
                description: 'Server hardware is setting up'
            };
        case ProvisioningStatus.DESTROYING:
            return {
                label: 'Removing',
                description: 'Server hardware is being removed'
            };
        case ProvisioningStatus.MIGRATING:
            return {
                label: 'Migrating',
                description: 'Server is migrating to new hardware'
            };
        case ProvisioningStatus.FAILED:
            return {
                label: 'Failed',
                description: 'Something went wrong provisioning server hardware'
            };
        case ProvisioningStatus.PENDING:
            return {
                label: 'Pending',
                description: 'Checking server hardware status...'
            };
        case ProvisioningStatus.ERROR:
            return {
                label: 'Error',
                description: 'There was an error while fetching server hardware status'
            };
        default:
            return {
                label: 'Error',
                description: 'There was an error while fetching server hardware status'
            };
    }
};

const getStatusStyles = (status: ProvisioningStatus) => {
    switch (status) {
        case ProvisioningStatus.READY:
            return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800";
        case ProvisioningStatus.PROVISIONING:
        case ProvisioningStatus.MIGRATING:
        case ProvisioningStatus.PENDING:
            return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800";
        case ProvisioningStatus.INACTIVE:
        case ProvisioningStatus.DESTROYING:
        case ProvisioningStatus.FAILED:
        case ProvisioningStatus.ERROR:
        default:
            return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";
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
    const styles = getStatusStyles(status);
    const icon = getStatusIcon(status);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge className={`inline-flex items-center border ${styles}`}>
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