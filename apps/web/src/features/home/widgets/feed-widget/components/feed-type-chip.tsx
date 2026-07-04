import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import ReviewBadge from '@/components/review-badge';
import { chipVariants } from '@/components/ui/chip';
import { cn } from '@/utils/cn';

import FeedContentTypeIcon from './feed-content-type-icon';

type FeedDataType = 'comment' | 'article' | 'collection';

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

const CHIP = chipVariants({ interactive: false });

type Props = {
    dataType: FeedDataType;
    recommended?: 'yes' | 'no' | 'maybe' | null;
};

const FeedTypeChip: FC<Props> = ({ dataType, recommended }) => {
    if (recommended) {
        return <ReviewBadge recommended={recommended} />;
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
