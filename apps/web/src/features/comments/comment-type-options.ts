import { LayoutGrid, MessageCircle, Star } from 'lucide-react';

import { CommentTypeEnum } from '@hikka/api';

import type { ChipTabOption } from '@/components/ui/chip-tabs';

export const COMMENT_TYPE_OPTIONS: ChipTabOption<CommentTypeEnum>[] = [
    {
        label: 'Усі',
        value: CommentTypeEnum.ALL,
        icon: LayoutGrid,
    },
    {
        label: 'Коментарі',
        value: CommentTypeEnum.COMMENT,
        icon: MessageCircle,
        activeClass:
            'border border-feed-comment/40 bg-feed-comment/15 text-feed-comment',
    },
    {
        label: 'Відгуки',
        value: CommentTypeEnum.REVIEW,
        icon: Star,
        activeClass:
            'border border-feed-review/40 bg-feed-review/15 text-feed-review',
    },
];
