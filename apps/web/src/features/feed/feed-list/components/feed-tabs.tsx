'use client';

import { Sparkles } from 'lucide-react';
import { FC } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FeedFilterEnum, FEED_FILTER_OPTIONS } from '../../types';

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
            <TabsList className="w-full justify-start">
                {Object.entries(FEED_FILTER_OPTIONS).map(([key, option]) => (
                    <TabsTrigger
                        key={key}
                        value={key}
                        className="flex gap-1.5"
                    >
                        {key === FeedFilterEnum.ALL && (
                            <Sparkles className="size-3.5" />
                        )}
                        {option.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default FeedTabs;
