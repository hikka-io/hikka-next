import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import { useParams } from '@/utils/navigation';

import ArticleAuthorCard from '../article-author-card';

type Props = {};

const ArticleViewAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    return <ArticleAuthorCard article={article!} className="surface" />;
};

export default ArticleViewAuthor;
