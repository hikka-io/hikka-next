'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Author from '@/components/article-item/article-author';
import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return <Author article={article!} />;
};

export default ArticleAuthor;
