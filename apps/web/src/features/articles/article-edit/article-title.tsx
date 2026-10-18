import { memo } from 'react';

import { Header, HeaderTitle } from '@/components/ui/header';

import { useArticleContext } from './article-provider';

const ArticleEditTitle = () => {
    const title = useArticleContext((state) => state.title);

    return (
        <Header>
            <HeaderTitle as="h1" size="page">
                {title || 'Нова стаття'}
            </HeaderTitle>
        </Header>
    );
};

export default memo(ArticleEditTitle);
