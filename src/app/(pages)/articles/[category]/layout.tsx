import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import _generateMetadata from '@/utils/generate-metadata';

interface Props {
    children: ReactNode;
    params: Promise<Record<string, any>>;
}

const ALLOWED_CATEGORIES = ['news', 'system', 'reviews'];

export interface MetadataProps {
    params: Promise<{ category: API.ArticleCategory }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const { category } = await params;

    const categoryInfo = ARTICLE_CATEGORY_OPTIONS.find(
        (cat) => cat.value === category,
    );

    return _generateMetadata({
        title: {
            default: categoryInfo!.label,
            template: `%s / ${categoryInfo!.label} / Hikka`,
        },
    });
}

const ArticlesLayout: FC<Props> = async ({ children, params }) => {
    const { category } = await params;

    if (!ALLOWED_CATEGORIES.includes(category)) {
        notFound();
    }

    return children;
};

export default ArticlesLayout;
