'use client';

import { FC } from 'react';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import { FeedFilterEnum } from '../../types';

interface Props {
    value: FeedFilterEnum;
    onChange: (value: FeedFilterEnum) => void;
}

const FeedTabs: FC<Props> = ({ value, onChange }) => {
    return (
        <div className="flex gap-2">
            <Tabs
                value={value}
                onValueChange={(v) => onChange(v as FeedFilterEnum)}
                className="flex-1"
            >
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar ">
                    {Object.entries(FEED_FILTER_OPTIONS).map(
                        ([key, option]) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="flex gap-2 sm:flex-1"
                            >
                                {option.icon && <option.icon />}
                                {option.label}
                            </TabsTrigger>
                        ),
                    )}
                </TabsList>
            </Tabs>
            <Tabs
                value={value}
                onValueChange={(v) => onChange(v as FeedFilterEnum)}
            >
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar ">
                    <TabsTrigger
                        value={FeedFilterEnum.ACTIVITY}
                        className="flex gap-2 sm:flex-1"
                    >
                        <MaterialSymbolsCalendarClockRounded />
                        Активність
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default FeedTabs;
