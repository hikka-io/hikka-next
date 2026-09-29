import { memo } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { useArticleContext } from './article-provider';

const ArticleEditTitle = () => {
    const title = useArticleContext((state) => state.title);

    return (
        <Header>
            <HeaderContainer>
                <HeaderTitle variant="h2">{title || 'Нова стаття'}</HeaderTitle>
            </HeaderContainer>
        </Header>
    );
};

export default memo(ArticleEditTitle);
