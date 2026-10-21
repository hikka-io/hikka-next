import type { FC } from 'react';

import type { CollectionsSearch } from '@hikka/core';

import {
    ClearFiltersFooter,
    TagFilter,
    UserFilter,
    useChangeParam,
} from '@/features/filters';
import { ContentPickerFilter } from '@/features/search';
import { cn } from '@/utils/cn';
import { useRouteSearch } from '@/utils/navigation';

import CollectionSort from './collection-sort';
import { COLLECTION_FILTERS_PRESERVE } from './constants';

type Props = {
    className?: string;
};

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const CollectionFiltersBody: FC<Props> = ({ className }) => {
    const { content_type, content_slug } =
        useRouteSearch<
            Pick<CollectionsSearch, 'content_type' | 'content_slug'>
        >();
    const handleChangeParam = useChangeParam();

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <CollectionSort />
            {content_type && (
                <ContentPickerFilter
                    label="Містить"
                    contentType={content_type}
                    slug={content_slug}
                    onChange={(slug) =>
                        handleChangeParam('content_slug', slug ?? '')
                    }
                />
            )}
            <UserFilter title="Автор" paramKey="author" />
            <TagFilter />
        </div>
    );
};

/** Side-panel composition: scrollable filter body + sticky footer. */
const CollectionListFilters: FC<Props> = ({ className }) => {
    return (
        <div className={cn('flex flex-1 flex-col lg:w-full', className)}>
            <CollectionFiltersBody className="flex-1 overflow-y-auto p-4 py-8" />
            <ClearFiltersFooter
                className="shrink-0 border-t p-4"
                preserve={COLLECTION_FILTERS_PRESERVE}
            />
        </div>
    );
};

export default CollectionListFilters;
