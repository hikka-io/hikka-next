import { type ComponentType, type FC, useRef } from 'react';

import { LayoutGrid, MessageCircle, Star } from 'lucide-react';

import type { UiFeedSettingsOutput } from '@hikka/api';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import { Chip } from '@/components/ui/chip';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import type { FeedSubTypeFilters } from './feed-sub-type-select';

type FeedContentType = NonNullable<
    UiFeedSettingsOutput['feed_content_types']
>[number];

type IconComponent = ComponentType<{ className?: string }>;

type Option = {
    label: string;
    value: FeedContentType | null;
    icon: IconComponent;
    activeClass: string;
};

const OPTIONS: Option[] = [
    {
        label: 'Усе',
        value: null,
        icon: LayoutGrid,
        activeClass:
            'border border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground',
    },
    {
        label: 'Відгуки',
        value: 'review',
        icon: Star,
        activeClass:
            'border border-feed-review/40 bg-feed-review/15 text-feed-review',
    },
    {
        label: 'Коментарі',
        value: 'comment',
        icon: MessageCircle,
        activeClass:
            'border border-feed-comment/40 bg-feed-comment/15 text-feed-comment',
    },
    {
        label: 'Колекції',
        value: 'collection',
        icon: MaterialSymbolsStack,
        activeClass:
            'border border-feed-collection/40 bg-feed-collection/15 text-feed-collection',
    },
    {
        label: 'Статті',
        value: 'article',
        icon: MaterialSymbolsDynamicFeedRounded,
        activeClass:
            'border border-feed-article/40 bg-feed-article/15 text-feed-article',
    },
];

type Props = {
    value: FeedSubTypeFilters;
    onChange: (next: FeedSubTypeFilters) => void;
};

const FeedQuickFilters: FC<Props> = ({ value, onChange }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    const active = value.feed_content_types;
    const isChipActive = (chip: FeedContentType | null): boolean =>
        chip === null
            ? active === null
            : active !== null && active.length === 1 && active[0] === chip;

    const handleSelect = (next: FeedContentType | null) => {
        onChange({
            ...value,
            feed_content_types: next ? [next] : null,
        });
    };

    return (
        <div
            ref={scrollRef}
            className={cn(
                'no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4',
                gradientClassName,
            )}
        >
            {OPTIONS.map((option) => {
                const isActive = isChipActive(option.value);
                const Icon = option.icon;
                return (
                    <Chip
                        key={option.label}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                            'border border-transparent px-3.5 text-sm',
                            isActive
                                ? option.activeClass
                                : 'bg-secondary/40 text-muted-foreground hover:bg-accent',
                        )}
                    >
                        <Icon className="size-4 shrink-0" />
                        {option.label}
                    </Chip>
                );
            })}
        </div>
    );
};

export default FeedQuickFilters;
