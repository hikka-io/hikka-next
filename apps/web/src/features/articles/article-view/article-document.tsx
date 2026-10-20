import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { Value } from 'platejs';

import { getArticleOptions } from '@hikka/api';
import { unwrapArticlePreview } from '@hikka/core';

import { StaticViewer } from '@/components/plate/editor/static-viewer';
import { useParams } from '@/utils/navigation';

type Props = {};

const ArticleViewDocument: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    if (!article) {
        return null;
    }

    return (
        <StaticViewer value={unwrapArticlePreview(article.document) as Value} />
    );
};

export default ArticleViewDocument;
