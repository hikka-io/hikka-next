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
        <div className="flex flex-col gap-4 min-h-28 md:min-h-0 flex-1 bg-secondary/30 border border-secondary/60 p-4 rounded-md">
            <div className="flex gap-2 items-center text-muted-foreground">
                <MaterialSymbolsBarChartRounded />
                <Label>Активність</Label>
            </div>
            <div className="flex gap-2 md:gap-4 justify-between items-end flex-1">
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
