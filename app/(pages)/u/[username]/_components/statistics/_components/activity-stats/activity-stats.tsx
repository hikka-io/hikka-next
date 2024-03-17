'use client';

import React from 'react';
import MaterialSymbolsBarChartRounded from '~icons/material-symbols/bar-chart-rounded';

import { useParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { convertToDays } from '@/utils/convertActivityStats';

import ActivityItem from './_components/ui/activity-item';
import useUserActivity from '@/services/hooks/user/useUserActivity';


const Component = () => {
    const params = useParams();

    const { data } = useUserActivity({ username: String(params.username) });

    const convertedData = convertToDays(data || []);
    const max = Math.max(...convertedData.map((day) => day.actions));

    return (
        <div className="flex min-h-28 flex-1 flex-col gap-4 rounded-md border border-secondary/60 bg-secondary/30 p-4 md:min-h-0">
            <div className="flex items-center gap-2 text-muted-foreground">
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

export default Component;
