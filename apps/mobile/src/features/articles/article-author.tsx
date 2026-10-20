import type { FC } from 'react';

import type { ArticleCategoryEnum, ArticlePreviewResponse } from '@hikka/api';
import { ARTICLE_CATEGORY, formatTimeAgo } from '@hikka/core';

import AuthorRow from '@/components/author-row';

type Props = {
    article: Pick<
        ArticlePreviewResponse,
        'author' | 'category' | 'draft' | 'updated'
    >;
    className?: string;
};

/** The web's `ArticleAuthorCard`: author, category and the publication time (or "Чернетка"). */
const ArticleAuthor: FC<Props> = ({ article, className }) => {
    const category = article.category as ArticleCategoryEnum;

    return (
        <AuthorRow
            username={article.author.username}
            avatar={article.author.avatar}
            meta={[
                ARTICLE_CATEGORY[category]?.title_ua ?? category,
                article.draft
                    ? 'Чернетка'
                    : formatTimeAgo(article.updated, Date.now()),
            ]}
            className={className}
        />
    );
};

export default ArticleAuthor;
