'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import useArticles from '@/services/hooks/articles/use-articles';

import ArticleItem from './article-item';

interface Props {}

const ArticleList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const author = searchParams.get('author') || undefined;
    const sort = searchParams.get('sort') || 'created';
    const order = searchParams.get('order') || 'desc';

    const { data: articles } = useArticles({
        author,
        sort: [`${sort}:${order}`],
    });

    return (
        <Block>
            <Header variant="h2" title="Новини" />
            <div className="flex flex-col gap-6">
                {articles?.list.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
            </div>
        </Block>
    );
};

export default ArticleList;
