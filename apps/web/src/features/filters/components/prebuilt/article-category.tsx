'use client';

import { SquareLibrary } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/badge-filter';
import { Label } from '@/components/ui/label';

import { useChangeParam } from '@/features/filters';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

interface Props {
    className?: string;
}

const ArticleCategory: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const categories = searchParams.getAll('categories');

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
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
