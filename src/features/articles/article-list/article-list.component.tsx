'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import ArticleItem from '@/components/article-item/article-item';
import FiltersNotFound from '@/components/filters-not-found';
import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import LoadMoreButton from '@/components/load-more-button';
import H3 from '@/components/typography/h3';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import ArticleFiltersModal from '@/features/modals/article-filters-modal.component';

import useArticles from '@/services/hooks/articles/use-articles';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {}

const ArticleList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const author = searchParams.get('author') || undefined;
    const sort = searchParams.get('sort') || 'created';
    const order = searchParams.get('order') || 'desc';
    const tags = searchParams.getAll('tags') || undefined;
    const draft = Boolean(searchParams.get('draft')) ?? false;
    const categories =
        (searchParams.getAll('categories') as API.ArticleCategory[]) || [];

    const { list, pagination, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useArticles({
            categories,
            author,
            sort: [`${sort}:${order}`],
            tags,
            draft,
        });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">
                        <span>Стрічка </span>
                        <H3 className="hidden text-muted-foreground md:inline">
                            ({pagination?.total ?? 0})
                        </H3>
                    </HeaderTitle>
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href={`${CONTENT_TYPE_LINKS['article']}/new`}>
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
                {hasNextPage && (
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </Block>
    );
};

export default ArticleList;
