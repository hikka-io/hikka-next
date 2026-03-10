import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
}

const FeedItemContentPreview: FC<Props> = ({ contentType, slug, title }) => {
    if (!contentType || !slug) return null;

    return (
        <div className="flex w-full items-center gap-2">
            <Badge variant="secondary" className="shrink-0">
                {CONTENT_TYPES[contentType].title_ua}
            </Badge>
            <Link
                href={`${CONTENT_TYPE_LINKS[contentType]}/${slug}`}
                className="text-primary-foreground flex items-center gap-1 hover:underline"
            >
                <small className="line-clamp-1">
                    {contentType === 'edit' ? `#${slug}` : title}
                </small>
            </Link>
        </div>
    );
};

export default FeedItemContentPreview;
