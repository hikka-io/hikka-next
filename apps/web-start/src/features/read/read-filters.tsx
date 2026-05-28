'use client';

import { ReadContentType } from '@hikka/client';
import { FC } from 'react';

import FiltersFooter from '@/features/filters/filters-footer';
import Genre from '@/features/filters/genre';
import Localization from '@/features/filters/localization';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Score from '@/features/filters/score';
import Year from '@/features/filters/year';

import { cn } from '@/utils/cn';

interface BodyProps {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
}

/**
 * Filter fields only — no footer, no outer padding/margin hacks.
 * Use this inside modals or any custom wrapper.
 */
export const ReadFiltersBody: FC<BodyProps> = ({
    className,
    content_type,
    sort_type,
}) => {
    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <ReleaseStatus />
            <Genre />
            <MediaType content_type={content_type} />
            <Localization />
            {(sort_type === 'manga' || sort_type === 'novel') && (
                <Score score_type="score" />
            )}
            <Year />
        </div>
    );
};

interface Props {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
}

/**
 * Default side-panel composition: scrollable filter body + sticky footer.
 * Kept for backward compatibility with the sidebar layout.
 */
const ReadFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    return (
        <div className={cn('flex flex-col', className)}>
            <ReadFiltersBody
                className="flex-1 overflow-y-auto p-4 py-8"
                content_type={content_type}
                sort_type={sort_type}
            />
            <FiltersFooter className="bg-secondary/20 shrink-0 border-t p-4" />
        </div>
    );
};

export default ReadFilters;
