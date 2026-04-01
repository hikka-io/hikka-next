'use client';

import { useArticleBySlug } from '@hikka/react';
import { FC } from 'react';

import { StaticViewer } from '@/components/plate/editor/static-viewer';

import { useParams } from '@/utils/navigation';

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

    return <StaticViewer value={document} />;
};

export default ArticleDocument;
