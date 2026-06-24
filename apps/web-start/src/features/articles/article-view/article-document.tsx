'use client';

import type { FC } from 'react';

import { useArticleBySlug } from '@hikka/react';

import { StaticViewer } from '@/components/plate/editor/static-viewer';
import { useParams } from '@/utils/navigation';

type Props = {};

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
