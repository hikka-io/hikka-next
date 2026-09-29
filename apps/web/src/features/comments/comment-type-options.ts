import { LayoutGrid, MessageCircle, Star } from 'lucide-react';

import type { ChipTabOption } from '@/components/ui/chip-tabs';

export type CommentType = 'all' | 'comment' | 'review';

export const COMMENT_TYPE_OPTIONS: ChipTabOption<CommentType>[] = [
    {
        label: 'Усі',
        value: 'all',
        icon: LayoutGrid,
    },
    {
        label: 'Коментарі',
        value: 'comment',
        icon: MessageCircle,
        activeClass:
            'border border-feed-comment/40 bg-feed-comment/15 text-feed-comment',
    },
    {
        label: 'Відгуки',
        value: 'review',
        icon: Star,
        activeClass:
            'border border-feed-review/40 bg-feed-review/15 text-feed-review',
    },
];
