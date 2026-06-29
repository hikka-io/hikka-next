import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { Value } from 'platejs';

import { getArticleOptions } from '@hikka/api';

import { StaticViewer } from '@/components/plate/editor/static-viewer';
import { useParams } from '@/utils/navigation';

type Props = {};

const ArticleDocumentView: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    if (!article) {
        return null;
    }

    const firstNode = article.document[0] as {
        type?: string;
        children?: unknown[];
    };
    const document =
        firstNode.type === 'preview'
            ? [...(firstNode.children ?? []), ...article.document.slice(1)]
            : article.document;

    return <StaticViewer value={document as Value} />;
};

export default ArticleDocumentView;
