'use client';

import { memo } from 'react';

import Header from '@/components/ui/header';

import { useArticleContext } from '@/services/providers/article-provider';

const ArticleTitle = () => {
    const title = useArticleContext((state) => state.title);

    console.log('ArticleTitle', title);

    return <Header title={title || 'Нова колекція'} />;
};

export default memo(ArticleTitle);
