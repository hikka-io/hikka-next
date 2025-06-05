'use client';

import { ArticleCategoryEnum } from '@hikka/client';
import { useSearchArticles, useSession } from '@hikka/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import ArticleItem from '@/components/article-item/article-item';
import FiltersNotFound from '@/components/filters-not-found';
import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import LoadMoreButton from '@/components/load-more-button';
import ArticleItemSkeleton from '@/components/skeletons/article-item-skeleton';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { cn } from '@/utils/utils';

import ArticleFiltersModal from '../../modals/article-filters-modal.component';

interface Props {}

const ArticleList: FC<Props> = () => {
    const { user } = useSession();
    const searchParams = useSearchParams();

    const author = searchParams.get('author') || undefined;
    const sort = searchParams.get('sort') || 'created';
    const order = searchParams.get('order') || 'desc';
    const tags = searchParams.getAll('tags') || undefined;
    const draft = Boolean(searchParams.get('draft')) ?? false;
    const categories =
        (searchParams.getAll('categories') as ArticleCategoryEnum[]) || [];

    const selectedCategory = categories.length === 1 && categories[0];

    const {
        ref,
        list,
        pagination,
        fetchNextPage,
        isFetchingNextPage,
        isPending,
        hasNextPage,
    } = useSearchArticles({
        args: {
            categories,
            author,
            sort: [`${sort}:${order}`],
            tags,
            draft,
        },
    });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">
                        {selectedCategory
                            ? ARTICLE_CATEGORY_OPTIONS[selectedCategory]
                                  ?.title_ua
                            : 'Статті'}
                    </HeaderTitle>
                    {user && (
                        <Button asChild size="icon-sm" variant="outline">
                            <Link href={`${CONTENT_TYPE_LINKS['article']}/new`}>
                                <MaterialSymbolsAddRounded className="size-4" />
                            </Link>
                        </Button>
                    )}
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
            <div
                className={cn(
                    '-mx-4 flex flex-col gap-6 md:mx-0',
                    (!list || list.length === 0) && 'mx-0',
                )}
            >
                {isPending && <ArticleItemSkeleton />}
                {list?.map((article) => (
                    <ArticleItem article={article} key={article.slug} />
                ))}
                {(!list || list.length === 0) && !isPending && (
                    <FiltersNotFound />
                )}
                {hasNextPage && (
                    <LoadMoreButton
                        ref={ref}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </Block>
    );
};

export default ArticleList;
