import type { FC } from 'react';

import { range } from '@antfu/utils';

import type { ArticlesSearch } from '@hikka/core';
import { CONTENT_TYPE_LINKS } from '@hikka/core';

import FiltersNotFound from '@/components/filters-not-found';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import LoadError from '@/components/load-error';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import DividedList from '@/components/ui/divided-list';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePageTitleAnchor } from '@/features/app-shell';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link, useRouteSearch } from '@/utils/navigation';

import { articleListOptions } from '../queries';
import ArticleCategoryChips from './article-category-chips';
import ArticleFiltersButton from './article-filters-button';
import ArticleItem from './article-item';
import ArticleItemSkeleton from './article-item-skeleton';

type Props = {};

const SKELETON_COUNT = 3;

const ArticleList: FC<Props> = () => {
    const titleAnchor = usePageTitleAnchor();
    const { user } = useSession();
    const search = useRouteSearch<ArticlesSearch>();

    const {
        ref,
        list,
        pagination,
        fetchNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        hasNextPage,
        refetch,
    } = useInfiniteList(articleListOptions(search));

    return (
        <Block>
            <Header>
                <HeaderTitle ref={titleAnchor} as="h1" size="page">
                    Статті
                </HeaderTitle>
                {user && (
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="Нова стаття"
                                    render={
                                        <Link
                                            to={`${CONTENT_TYPE_LINKS.article}/new`}
                                        />
                                    }
                                />
                            }
                        >
                            <MaterialSymbolsAddRounded className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>Нова стаття</TooltipContent>
                    </Tooltip>
                )}
                <HeaderActions className="md:hidden">
                    <ArticleFiltersButton />
                </HeaderActions>
            </Header>
            <ArticleCategoryChips />
            <DividedList>
                {isPending &&
                    range(0, SKELETON_COUNT).map((index) => (
                        <ArticleItemSkeleton key={index} />
                    ))}
                {list?.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
            </DividedList>
            {isError && !list && (
                <LoadError
                    title="Не вдалося завантажити статті"
                    onRetry={() => refetch()}
                />
            )}
            {list?.length === 0 && (
                <FiltersNotFound search={{ categories: search.categories }} />
            )}
            {hasNextPage && (
                <LoadMoreButton
                    ref={ref}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}
        </Block>
    );
};

export default ArticleList;
