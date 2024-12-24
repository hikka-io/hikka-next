'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleTitle: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return (
        <Header>
            <HeaderContainer>
                <HeaderTitle variant="h2">{article!.title}</HeaderTitle>
            </HeaderContainer>
        </Header>
    );
};

export default ArticleTitle;
