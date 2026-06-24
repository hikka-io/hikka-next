import type { FC } from 'react';

import { useArticleBySlug } from '@hikka/react';

import { useParams } from '@/utils/navigation';

import Author from '../article-item/article-author';

type Props = {};

const ArticleAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticleBySlug({
        slug: String(params.slug),
    });

    return (
        <Author
            article={article!}
            className="bg-secondary/20 backdrop-blur-xl"
        />
    );
};

export default ArticleAuthor;
