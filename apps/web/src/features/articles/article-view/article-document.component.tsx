'use client';

import { useArticleBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ArticleViewer from '@/components/markdown/editor/article-viewer';

interface Props {}

const ArticleDocument: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticleBySlug({
        slug: String(params.slug),
    });

    if (!article) {
        return null;
    }

    const document =
        article.document[0].type === 'preview'
            ? [...article.document[0].children, ...article.document.slice(1)]
            : article.document;

    return <ArticleViewer initialValue={document} />;
};

export default ArticleDocument;
