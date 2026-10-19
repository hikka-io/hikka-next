import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES } from '@hikka/core';

import ContentTypeIcon from '@/components/content-type-icon';
import { Chip } from '@/components/ui/chip';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

type Props = {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
    className?: string;
    /** Makes the chip a button instead of a link to the content. */
    onClick?: () => void;
    'aria-label'?: string;
};

const ContentRefChip: FC<Props> = ({
    contentType,
    slug,
    title,
    className,
    onClick,
    ...props
}) => {
    if (!contentType || !slug) return null;

    const label = contentType === 'edit' ? `#${slug}` : title;

    return (
        <Chip
            className={cn(
                'min-w-0 max-w-full shrink bg-secondary/40 text-muted-foreground hover:bg-accent',
                className,
            )}
            render={
                onClick ? undefined : (
                    <Link to={contentPath(contentType, slug)} />
                )
            }
            onClick={onClick}
            {...props}
        >
            <ContentTypeIcon
                contentType={contentType}
                className="size-3.5 shrink-0"
            />
            <span className="min-w-0 max-w-[16rem] truncate text-foreground">
                {label}
            </span>
            <span className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <span className="shrink-0">
                {CONTENT_TYPES[contentType].title_ua}
            </span>
        </Chip>
    );
};

export default ContentRefChip;
