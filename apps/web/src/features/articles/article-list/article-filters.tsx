import type { FC } from 'react';

import { ArticleContentEnum } from '@hikka/api';
import type { ArticlesSearch } from '@hikka/core';

import {
    ArticleDraftsFilter,
    ClearFiltersFooter,
    ContentTypeFilter,
    Sort,
    TagFilter,
    UserFilter,
    useChangeParam,
} from '@/features/filters';
import { ContentPickerFilter } from '@/features/search';
import { useSession } from '@/services/session';
import { cn } from '@/utils/cn';
import { useRouteSearch } from '@/utils/navigation';

import { ARTICLE_FILTERS_PRESERVE } from './constants';

type Props = {
    className?: string;
};

const ARTICLE_CONTENT_TYPES = Object.values(ArticleContentEnum);

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const ArticleFiltersBody: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { content_type, content_slug } =
        useRouteSearch<Pick<ArticlesSearch, 'content_type' | 'content_slug'>>();
    const handleChangeParam = useChangeParam();

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <Sort sort_type="article" />
            <ContentTypeFilter
                contentTypes={ARTICLE_CONTENT_TYPES}
                clearOnChange={['content_slug']}
            />
            {content_type && (
                <ContentPickerFilter
                    label="Про тайтл"
                    contentType={content_type}
                    slug={content_slug}
                    onChange={(slug) =>
                        handleChangeParam('content_slug', slug ?? '')
                    }
                />
            )}
            <UserFilter title="Автор" paramKey="author" />
            <TagFilter />
            {user && <ArticleDraftsFilter />}
        </div>
    );
};

/** Side-panel composition: scrollable filter body + sticky footer. */
const ArticleListFilters: FC<Props> = ({ className }) => {
    return (
        <div className={cn('flex flex-1 flex-col lg:w-full', className)}>
            <ArticleFiltersBody className="flex-1 overflow-y-auto p-4 py-8" />
            <ClearFiltersFooter
                className="shrink-0 border-t p-4"
                preserve={ARTICLE_FILTERS_PRESERVE}
            />
        </div>
    );
};

export default ArticleListFilters;
