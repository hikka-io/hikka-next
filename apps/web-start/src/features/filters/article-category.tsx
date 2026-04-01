'use client';

import { SquareLibrary } from 'lucide-react';
import { FC } from 'react';

import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const ArticleCategory: FC<Props> = () => {
    const { categories = [] } = useFilterSearch<{ categories?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <SquareLibrary className="size-4 shrink-0" />
                <Label>Категорія</Label>
            </div>
            <BadgeFilter
                properties={Object.fromEntries(
                    Object.entries(ARTICLE_CATEGORY_OPTIONS).filter(
                        ([, value]) => !value.admin,
                    ),
                )}
                selected={categories}
                property="categories"
                onParamChange={handleChangeParam}
            />
        </div>
    );
};

export default ArticleCategory;
