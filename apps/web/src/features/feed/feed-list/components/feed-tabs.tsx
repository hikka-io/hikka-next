'use client';

import { FC } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import { FeedFilterEnum } from '../../types';

interface Props {
    value: FeedFilterEnum;
    onChange: (value: FeedFilterEnum) => void;
}

const FeedTabs: FC<Props> = ({ value, onChange }) => {
    return (
        <Tabs
            value={value}
            onValueChange={(v) => onChange(v as FeedFilterEnum)}
        >
            <TabsList
                variant="underline"
                className="w-full justify-start overflow-x-auto no-scrollbar bg-secondary/20 backdrop-blur rounded-md border"
            >
                {Object.entries(FEED_FILTER_OPTIONS).map(([key, option]) => (
                    <TabsTrigger
                        key={key}
                        value={key}
                        className="flex gap-2 sm:flex-1"
                    >
                        {option.icon && <option.icon />}
                        {option.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default FeedTabs;
