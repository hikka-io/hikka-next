'use client';

import { useArticleBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import Author from '@/components/article-item/article-author';

interface Props {}

const ArticleAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticleBySlug({
        slug: String(params.slug),
    });

    return <Author article={article!} />;
};

export default ArticleAuthor;
