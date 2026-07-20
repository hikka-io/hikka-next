import type { FC } from 'react';

import type {
    ArticleCategoryEnum,
    ContentTypeEnum,
    ReviewResponse,
} from '@hikka/api';

import { ReviewBadge } from '@/components/badges';
import { chipVariants } from '@/components/ui/chip';
import { cn } from '@/utils/cn';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/filter-properties';

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
    recommended?: ReviewResponse['recommended'] | null;
    category?: ArticleCategoryEnum | null;
};

const FeedTypeChip: FC<Props> = ({ dataType, recommended, category }) => {
    if (recommended) {
        return <ReviewBadge recommended={recommended} />;
    }

    if (dataType === 'comment') {
        return null;
    }

    if (dataType === 'article' && category) {
        const option = ARTICLE_CATEGORY_OPTIONS[category];
        if (option) {
            const Icon = option.icon;
            return (
                <span className={cn(CHIP, TYPE_STYLES.article)}>
                    {Icon && <Icon className="size-3.5" />}
                    {option.title_ua}
                </span>
            );
        }
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
