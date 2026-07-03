import type { FC } from 'react';

import {
    ContentTypeEnum,
    type ReadContentTypeEnum as ReadContentType,
} from '@hikka/api';

import FiltersFooter from '@/features/filters/filters-footer';
import Genre from '@/features/filters/genre';
import Localization from '@/features/filters/localization';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Score from '@/features/filters/score';
import Year from '@/features/filters/year';
import { cn } from '@/utils/cn';

type BodyProps = {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
};

/**
 * Maps the read sort context to the preset content type. The user's read list
 * (`read`) returns undefined so the footer hides the catalog-only preset action.
 */
export const readPresetContentType = (
    sort_type: 'manga' | 'novel' | 'read',
): ContentTypeEnum | undefined => {
    if (sort_type === 'manga') return ContentTypeEnum.MANGA;
    if (sort_type === 'novel') return ContentTypeEnum.NOVEL;
    return undefined;
};

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

type Props = {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
};

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
            <FiltersFooter
                className="shrink-0 border-t p-4"
                contentType={readPresetContentType(sort_type)}
            />
        </div>
    );
};

export default ReadFilters;
