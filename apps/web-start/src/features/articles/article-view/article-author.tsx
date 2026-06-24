import type { FC } from 'react';

import { useArticleBySlug } from '@hikka/react';

import Author from '../article-item/article-author';
import { useParams } from '@/utils/navigation';

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
