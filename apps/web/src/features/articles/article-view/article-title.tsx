import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import { Header, HeaderTitle } from '@/components/ui/header';
import { usePageTitleAnchor } from '@/features/app-shell';
import { useParams } from '@/utils/navigation';

import ArticleContentChip from '../article-content-chip';

type Props = {};

const ArticleViewTitle: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    const titleAnchor = usePageTitleAnchor();

    return (
        <div className="flex flex-col gap-3">
            {article?.content && (
                <ArticleContentChip
                    content={article.content}
                    className="self-start"
                />
            )}
            <Header>
                <HeaderTitle ref={titleAnchor} as="h1" size="page">
                    {article!.title}
                </HeaderTitle>
            </Header>
        </div>
    );
};

export default ArticleViewTitle;
