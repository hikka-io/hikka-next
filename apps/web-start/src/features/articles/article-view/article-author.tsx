import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import { useParams } from '@/utils/navigation';

import Author from '../article-item/article-author';

type Props = {};

const ArticleAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    return (
        <Author
            article={article!}
            className="bg-secondary/20 backdrop-blur-xl"
        />
    );
};

export default ArticleAuthor;
