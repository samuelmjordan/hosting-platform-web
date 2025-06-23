import React from 'react';

export const RegionBadge = ({ region = "" }) => {
    const regionData: Record<string, { flag: string; color: string }> = {
        europe: { flag: "🇪🇺", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
        "north america": { flag: "🇺🇸", color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" },
        singapore: { flag: "🇸🇬", color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" }
    };

    const normalizedRegion = region.toLowerCase().trim();
    const data = regionData[normalizedRegion];

    if (!data) {
        return (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                <span className="mr-1">❓</span>
                unknown
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${data.color}`}>
            <span className="mr-1">{data.flag}</span>
            {normalizedRegion}
        </div>
    );
};