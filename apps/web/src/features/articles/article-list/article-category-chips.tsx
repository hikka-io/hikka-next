import type { FC } from 'react';

import { LayoutGrid } from 'lucide-react';

import type { ArticleCategoryEnum } from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    type ArticlesSearch,
    PUBLIC_ARTICLE_CATEGORIES,
} from '@hikka/core';

import { ARTICLE_CATEGORY_ICONS } from '@/components/icons/article-category-icons';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import { useChangeParam } from '@/features/filters';
import { useRouteSearch } from '@/utils/navigation';

const ALL = 'all';

// '' selects no chip: an older link can still carry several categories.
type Value = ArticleCategoryEnum | typeof ALL | '';

const OPTIONS: ChipTabOption<Value>[] = [
    { label: 'Усе', value: ALL, icon: LayoutGrid },
    ...PUBLIC_ARTICLE_CATEGORIES.map((category) => ({
        label: ARTICLE_CATEGORY[category].title_ua,
        value: category,
        icon: ARTICLE_CATEGORY_ICONS[category] ?? undefined,
    })),
];

const ArticleCategoryChips: FC = () => {
    const { categories = [] } =
        useRouteSearch<Pick<ArticlesSearch, 'categories'>>();
    const handleChangeParam = useChangeParam();

    const value: Value =
        categories.length === 0
            ? ALL
            : categories.length === 1
              ? (categories[0] as ArticleCategoryEnum)
              : '';

    return (
        <ChipTabs
            options={OPTIONS}
            value={value}
            onValueChange={(next) =>
                handleChangeParam(
                    'categories',
                    next === ALL || !next ? [] : [next],
                )
            }
        />
    );
};

export default ArticleCategoryChips;
