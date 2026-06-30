import type { FC } from 'react';

import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import { chipVariants } from '@/components/ui/chip';
import { cn } from '@/utils/cn';

import FeedContentTypeIcon from './feed-content-type-icon';

type FeedDataType = 'comment' | 'article' | 'collection';
type Recommended = 'yes' | 'no' | 'maybe';

const TYPE_LABELS: Record<FeedDataType, string> = {
    comment: 'Коментар',
    article: 'Стаття',
    collection: 'Колекція',
};

// token text color + faint same-color tint background
const TYPE_STYLES: Record<FeedDataType, string> = {
    comment: 'text-feed-comment bg-feed-comment/10',
    article: 'text-feed-article bg-feed-article/10',
    collection: 'text-feed-collection bg-feed-collection/10',
};

const VERDICT: Record<
    Recommended,
    { label: string; className: string; icon: LucideIcon }
> = {
    yes: {
        label: 'Рекомендує',
        className: 'text-success bg-success/10',
        icon: ThumbsUp,
    },
    no: {
        label: 'Не рекомендує',
        className: 'text-destructive bg-destructive/10',
        icon: ThumbsDown,
    },
    maybe: {
        label: 'Вагається',
        className: 'text-warning bg-warning/10',
        icon: Meh,
    },
};

const CHIP = chipVariants({ interactive: false });

type Props = {
    dataType: FeedDataType;
    recommended?: Recommended | null;
};

const FeedTypeChip: FC<Props> = ({ dataType, recommended }) => {
    const verdict = recommended ? VERDICT[recommended] : undefined;

    if (verdict) {
        const Icon = verdict.icon;
        return (
            <span className={cn(CHIP, verdict.className)}>
                <Icon className="size-3.5" />
                {verdict.label}
            </span>
        );
    }

    return (
        <span className={cn(CHIP, TYPE_STYLES[dataType])}>
            <FeedContentTypeIcon
                contentType={dataType as ContentTypeEnum}
                className="size-3.5"
            />
            {TYPE_LABELS[dataType]}
        </span>
    );
};

export default FeedTypeChip;
