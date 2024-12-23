'use client';

import { memo } from 'react';

import Header from '@/components/ui/header';

import { useArticleContext } from '@/services/providers/article-provider';

const ArticleTitle = () => {
    const title = useArticleContext((state) => state.title);

    return <Header title={title || 'Нова стаття'} />;
};

export default memo(ArticleTitle);
