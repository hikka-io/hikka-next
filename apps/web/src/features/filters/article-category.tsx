import type { FC } from 'react';

import { SquareLibrary } from 'lucide-react';

import { ARTICLE_CATEGORY_ICONS } from '@/components/icons/article-category-icons';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { ARTICLE_CATEGORY } from '@/utils/constants/common';
import { useRouteSearch } from '@/utils/navigation';
import type { ArticlesSearch } from '@/utils/search-schemas';

import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const ArticleCategoryFilter: FC<Props> = () => {
    const { categories = [] } =
        useRouteSearch<Pick<ArticlesSearch, 'categories'>>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <SquareLibrary className="size-4 shrink-0" />
                <Label>Категорія</Label>
            </div>
            <BadgeFilter
                properties={Object.fromEntries(
                    Object.entries(ARTICLE_CATEGORY).filter(
                        ([, value]) => !value.admin,
                    ),
                )}
                icons={ARTICLE_CATEGORY_ICONS}
                selected={categories}
                property="categories"
                onParamChange={handleChangeParam}
            />
        </div>
    );
};

export default ArticleCategoryFilter;
