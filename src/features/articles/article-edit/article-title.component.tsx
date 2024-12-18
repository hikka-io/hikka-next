'use client';

import { memo } from 'react';

import Header from '@/components/ui/header';

import { useArticleStore } from '@/services/stores/article-store';

const ArticleTitle = () => {
    const title = useArticleStore((state) => state.title);

    console.log('ArticleTitle', title);

    return <Header title={title || 'Нова колекція'} />;
};

export default memo(ArticleTitle);
