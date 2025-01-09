'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import ArticleViewer from '@/components/markdown/editor/article-viewer';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleText: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return <ArticleViewer initialValue={article?.document} />;
};

export default ArticleText;
