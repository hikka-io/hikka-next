import type { FC } from 'react';

import {
    ArticleCategoryFilter,
    ArticleDraftsFilter,
    ClearFiltersFooter,
    Sort,
    TagFilter,
    UserFilter,
} from '@/features/filters';
import { useSession } from '@/services/session';
import { cn } from '@/utils/cn';

type Props = {
    className?: string;
};

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const ArticleFiltersBody: FC<Props> = ({ className }) => {
    const { user } = useSession();

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <ArticleCategoryFilter />
            <Sort sort_type="article" />
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
            <ClearFiltersFooter className="shrink-0 border-t p-4" />
        </div>
    );
};

export default ArticleListFilters;
