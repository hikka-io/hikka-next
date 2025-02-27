'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import ArticleViewer from '@/components/markdown/editor/article-viewer';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleDocument: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    if (!article) {
        return null;
    }

    return (
        <ArticleViewer
            initialValue={[
                ...article.document[0].children,
                ...article.document.slice(1),
            ]}
        />
    );
};

export default ArticleDocument;
