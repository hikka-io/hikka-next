import type { FC } from 'react';

import { formatDistance } from 'date-fns';

import type { ContentTypeEnum, FollowUserResponse } from '@hikka/api';

import { Label } from '@/components/ui/label';
import { Link } from '@/utils/navigation';

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
    reference?: Reference;
    shareUrl: string;
};

const FeedItemHeader: FC<Props> = ({
    author,
    dataType,
    created,
    recommended,
    reference,
    shareUrl,
}) => {
    const hasReference = reference?.contentType && reference?.slug;

    return (
        <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Label asChild className="truncate">
                        <Link to={`/u/${author.username}`}>
                            {author.username}
                        </Link>
                    </Label>
                    <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="shrink-0 text-muted-foreground text-xs">
                        {formatDistance(created * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                    <FeedTypeChip
                        dataType={dataType}
                        recommended={recommended}
                    />
                    {hasReference && (
                        <FeedContentRef
                            contentType={reference.contentType}
                            slug={reference.slug}
                            title={reference.title}
                        />
                    )}
                </div>
            </div>
            <FeedItemMenu author={author} shareUrl={shareUrl} />
        </div>
    );
};

export default FeedItemHeader;
