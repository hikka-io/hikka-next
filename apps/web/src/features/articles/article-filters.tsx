import type { FC } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import ArticleCategory from '@/features/filters/article-category';
import ArticleCustomization from '@/features/filters/article-customization';
import ClearFiltersFooter from '@/features/filters/clear-filters-footer';
import Sort from '@/features/filters/sort';
import Tag from '@/features/filters/tag';
import User from '@/features/filters/user';
import { cn } from '@/utils/cn';

type Props = {
    className?: string;
};

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const ArticleFiltersBody: FC<Props> = ({ className }) => {
    const { user } = useSession();

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <ArticleCategory />
            <Sort sort_type="article" />
            <User title="Автор" paramKey="author" />
            <Tag />
            {user && <ArticleCustomization />}
        </div>
    );
};

/** Side-panel composition: scrollable filter body + sticky footer. */
const ArticleFilters: FC<Props> = ({ className }) => {
    return (
        <div className={cn('flex flex-1 flex-col lg:w-full', className)}>
            <ArticleFiltersBody className="flex-1 overflow-y-auto p-4 py-8" />
            <ClearFiltersFooter className="shrink-0 border-t p-4" />
        </div>
    );
};

export default ArticleFilters;
