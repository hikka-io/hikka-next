'use client';

import { FC, useRef } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import { FeedFilterEnum } from '../../../types';

interface Props {
    value: FeedFilterEnum;
    onChange: (value: FeedFilterEnum) => void;
}

const FeedTabs: FC<Props> = ({ value, onChange }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    return (
        <div className="flex w-full gap-2 overflow-hidden">
            <Tabs
                value={value}
                onValueChange={(v) => onChange(v as FeedFilterEnum)}
                className="flex-1 overflow-hidden"
            >
                <TabsList
                    ref={scrollRef}
                    className={cn(
                        'no-scrollbar w-full justify-start overflow-x-auto',
                        gradientClassName,
                    )}
                >
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
        </div>
    );
};

export default FeedTabs;
