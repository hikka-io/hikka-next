import type { FC } from 'react';

import type {
    ArticleCategoryEnum,
    ContentTypeEnum,
    FollowUserResponse,
} from '@hikka/api';

import AuthorMetaRow from '@/components/author-meta-row';

import FeedContentRef from './feed-content-ref';
import FeedItemMenu from './feed-item-menu';
import FeedTypeChip from './feed-type-chip';

type Reference = {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
};

type Props = {
    author: FollowUserResponse;
    dataType: 'comment' | 'article' | 'collection';
    created: number;
    recommended?: 'yes' | 'no' | 'maybe' | null;
    category?: ArticleCategoryEnum | null;
    reference?: Reference;
    shareUrl: string;
};

const FeedItemHeader: FC<Props> = ({
    author,
    dataType,
    created,
    recommended,
    category,
    reference,
    shareUrl,
}) => {
    const hasReference = reference?.contentType && reference?.slug;

    return (
        <div className="relative flex min-w-0 flex-col gap-3 pr-9">
            <AuthorMetaRow username={author.username} created={created} />
            <div className="flex flex-col items-start gap-2 overflow-hidden sm:flex-row sm:items-center">
                <FeedTypeChip
                    dataType={dataType}
                    recommended={recommended}
                    category={category}
                />
                {hasReference && (
                    <FeedContentRef
                        contentType={reference.contentType}
                        slug={reference.slug}
                        title={reference.title}
                    />
                )}
            </div>
            <div className="absolute top-0 right-0">
                <FeedItemMenu author={author} shareUrl={shareUrl} />
            </div>
        </div>
    );
};

export default FeedItemHeader;
