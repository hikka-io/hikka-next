import type { FC } from 'react';

import type { CollectionResponse } from '@hikka/api';
import { CONTENT_TYPES } from '@hikka/core';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

type Props = {
    collection: CollectionResponse;
    className?: string;
};

/** The content type first, then the spoiler and +18 flags and the tags; phones show the first tag and a count. */
const CollectionBadges: FC<Props> = ({ collection, className }) => {
    const { content_type: contentType, tags } = collection;
    const TypeIcon = CONTENT_TYPE_ICONS[contentType];

    return (
        <div className={cn('flex gap-2', className)}>
            <Badge variant="outline">
                <TypeIcon />
                {CONTENT_TYPES[contentType].plural ??
                    CONTENT_TYPES[contentType].title_ua}
            </Badge>
            {collection.spoiler && <Badge variant="warning">Спойлери</Badge>}
            {collection.nsfw && <Badge variant="destructive">+18</Badge>}
            {tags.length > 0 && <Badge variant="secondary">{tags[0]}</Badge>}
            {tags.slice(1).map((tag) => (
                <Badge
                    key={tag}
                    className="hidden md:block"
                    variant="secondary"
                >
                    {tag}
                </Badge>
            ))}
            {tags.length > 1 && (
                <Badge variant="outline" className="block md:hidden">
                    +{tags.length - 1}
                </Badge>
            )}
        </div>
    );
};

export default CollectionBadges;
