'use client';

import { useUserActivity } from '@hikka/react';
import { useParams } from 'next/navigation';

import { MaterialSymbolsBarChartRounded } from '@/components/icons/material-symbols/MaterialSymbolsBarChartRounded';
import { Label } from '@/components/ui/label';

import { convertToDays } from '@/utils/adapters/convert-activity-stats';

import ActivityItem from './activity-item';

const ActivityStats = () => {
    const params = useParams();

    const { data } = useUserActivity({
        username: String(params.username),
        options: {
            enabled: !!params.username,
        },
    });

    const convertedData = convertToDays(data || []);
    const max = Math.max(...convertedData.map((day) => day.actions));

    return (
        <div className="border-border bg-secondary/20 flex min-h-28 flex-1 flex-col gap-4 rounded-md border p-4 md:min-h-0">
            <div className="text-muted-foreground flex items-center gap-2">
                <MaterialSymbolsBarChartRounded />
                <Label>Активність</Label>
            </div>
            <div className="flex flex-1 items-end justify-between gap-2 md:gap-4">
                {convertedData.map((item, index) => (
                    <ActivityItem
                        key={item.timestamp !== 0 ? item.timestamp : index}
                        item={item}
                        max={max}
                    />
                ))}
            </div>
        </div>
    );
};

export default ActivityStats;
