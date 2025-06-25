import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock } from "lucide-react";

const getInstallStatusInfo = (installed: boolean) => {
    return installed
        ? {
            label: 'Installed',
            description: 'Server installer has finished running'
        }
        : {
            label: 'Not Installed',
            description: 'Server installer has not finished running'
        };
};

const getStatusStyles = (installed: boolean) => {
    return installed
        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
        : "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800";
};

const getStatusIcon = (installed: boolean) => {
    const iconProps = { className: "w-3 h-3 mr-1" };

    return installed
        ? <CheckCircle {...iconProps} />
        : <div className="w-3 h-3 mr-1 border border-current border-t-transparent rounded-full animate-spin" />;
};

interface InstallStatusBadgeProps {
    installed: boolean;
}

export const InstallStatusBadge = ({ installed }: InstallStatusBadgeProps) => {
    const statusInfo = getInstallStatusInfo(installed);
    const styles = getStatusStyles(installed);
    const icon = getStatusIcon(installed);

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