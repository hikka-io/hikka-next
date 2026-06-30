import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import { Chip } from '@/components/ui/chip';
import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

import FeedContentTypeIcon from './feed-content-type-icon';

type Props = {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
};

const FeedContentRef: FC<Props> = ({ contentType, slug, title }) => {
    if (!contentType || !slug) return null;

    const label = contentType === 'edit' ? `#${slug}` : title;

    return (
        <Chip
            asChild
            className="min-w-0 bg-secondary/40 text-muted-foreground hover:bg-secondary"
        >
            <Link to={`${CONTENT_TYPE_LINKS[contentType]}/${slug}`}>
                <FeedContentTypeIcon
                    contentType={contentType}
                    className="size-3.5 shrink-0"
                />
                <span className="min-w-0 max-w-[16rem] truncate text-foreground">
                    {label}
                </span>
                <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                <span className="shrink-0">
                    {CONTENT_TYPES[contentType].title_ua}
                </span>
            </Link>
        </Chip>
    );
};

export default FeedContentRef;
