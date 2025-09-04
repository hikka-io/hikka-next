'use client';

import { memo } from 'react';

import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '@/components/ui/header';
import { useArticleContext } from '@/services/providers/article-provider';

const ArticleTitle = () => {
    const title = useArticleContext((state) => state.title);

    return (
        <Header>
            <HeaderContainer>
                <HeaderTitle variant="h2">{title || 'Нова стаття'}</HeaderTitle>
            </HeaderContainer>
        </Header>
    );
};

export default memo(ArticleTitle);
