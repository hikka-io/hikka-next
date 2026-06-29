import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

type Props = {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
};

const FeedItemContentPreview: FC<Props> = ({ contentType, slug, title }) => {
    if (!contentType || !slug) return null;

    return (
        <div className="flex w-full items-center gap-2">
            <Badge variant="secondary" className="shrink-0">
                {CONTENT_TYPES[contentType].title_ua}
            </Badge>
            <Link
                to={`${CONTENT_TYPE_LINKS[contentType]}/${slug}`}
                className="flex items-center gap-1 text-primary-foreground hover:underline"
            >
                <small className="line-clamp-1">
                    {contentType === 'edit' ? `#${slug}` : title}
                </small>
            </Link>
        </div>
    );
};

export default FeedItemContentPreview;
