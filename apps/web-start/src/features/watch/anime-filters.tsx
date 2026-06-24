'use client';

import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import AgeRating from '@/features/filters/age-rating';
import DateRange from '@/features/filters/date-range';
import FiltersFooter from '@/features/filters/filters-footer';
import Genre from '@/features/filters/genre';
import Localization from '@/features/filters/localization';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Score from '@/features/filters/score';
import Season from '@/features/filters/season';
import Studio from '@/features/filters/studio';
import Year from '@/features/filters/year';

import { cn } from '@/utils/cn';

interface BodyProps {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

/**
 * Filter fields only — no footer, no outer padding/margin hacks.
 * Use this inside modals or any custom wrapper.
 */
export const AnimeFiltersBody: FC<BodyProps> = ({
    className,
    content_type,
    sort_type,
}) => {
    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <Genre />
            <Studio />
            <ReleaseStatus />
            <Season />
            <MediaType content_type={content_type} />
            <AgeRating />
            <Score score_type="score" />
            <Year />
            {sort_type === 'anime' && <DateRange />}
            <Localization />
        </div>
    );
};

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

/**
 * Default side-panel composition: scrollable filter body + sticky footer.
 * Kept for backward compatibility with the sidebar layout.
 */
const AnimeFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    return (
        <div className={cn('flex flex-col ', className)}>
            <AnimeFiltersBody
                className="flex-1 overflow-y-auto p-4 py-8"
                content_type={content_type}
                sort_type={sort_type}
            />
            <FiltersFooter
                className="bg-secondary/20 shrink-0 border-t p-4"
                contentType={
                    sort_type === 'anime' ? ContentTypeEnum.ANIME : undefined
                }
            />
        </div>
    );
};

export default AnimeFilters;
