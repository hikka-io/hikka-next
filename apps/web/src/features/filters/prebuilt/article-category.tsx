'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import BadgeFilter from '../components/badge-filter';
import CollapsibleFilter from '../components/collapsible-filter';
import useChangeParam from '../hooks/use-change-param';

interface Props {
    className?: string;
}

const ArticleCategory: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const categories = searchParams.getAll('categories');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            defaultOpen
            title="Категорія"
            active={categories.length > 0}
        >
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
        </CollapsibleFilter>
    );
};

export default ArticleCategory;
