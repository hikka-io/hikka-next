'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import ArticleItem from '@/components/article-item/article-item';
import FiltersNotFound from '@/components/filters-not-found';
import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import ArticleFiltersModal from '@/features/modals/article-filters-modal.component';

import useArticles from '@/services/hooks/articles/use-articles';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

interface Props {}

const ArticleList: FC<Props> = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const category = ARTICLE_CATEGORY_OPTIONS.find(
        (cat) => cat.value === params.category,
    );

    const author = searchParams.get('author') || undefined;
    const sort = searchParams.get('sort') || 'created';
    const order = searchParams.get('order') || 'desc';
    const tags = searchParams.getAll('tags') || undefined;

    const { list } = useArticles({
        category: category?.value as API.ArticleCategory,
        author,
        sort: [`${sort}:${order}`],
        tags,
    });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">{category?.label}</HeaderTitle>
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href={`/${category?.value}/new`}>
                            <MaterialSymbolsAddRounded className="size-4" />
                        </Link>
                    </Button>
                </HeaderContainer>
                <ArticleFiltersModal>
                    <Button
                        variant="outline"
                        size="md"
                        className="flex md:hidden"
                    >
                        <AntDesignFilterFilled /> Фільтри
                    </Button>
                </ArticleFiltersModal>
            </Header>
            <div className="flex flex-col gap-6">
                {list?.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
                {!list || (list.length === 0 && <FiltersNotFound />)}
            </div>
        </Block>
    );
};

export default ArticleList;
