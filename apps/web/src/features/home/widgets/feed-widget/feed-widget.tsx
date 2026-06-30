import { type FC, useEffect, useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import {
    ContentTypeEnum,
    type FeedArgs,
    feedPageParam,
    getFeedInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import LoadMoreButton from '@/components/load-more-button';
import Card from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import EmptyState from '@/components/ui/empty-state';
import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';

import type { WidgetProps } from '../../constants';
import FeedItem, { type FeedItemResponse } from './components/feed-item';
import FeedItemSkeleton from './components/feed-item-skeleton';
import FeedQuickFilters from './components/feed-quick-filters';
import FeedSubTypeSelect, {
    type FeedSubTypeFilters,
} from './components/feed-sub-type-select';

function getFeedItemKey(item: FeedItemResponse): string {
    if (item.data_type === ContentTypeEnum.ARTICLE) return item.slug;
    return item.reference;
}

const EMPTY_FILTERS: FeedSubTypeFilters = {
    feed_content_types: null,
    comment_content_types: null,
    article_content_types: null,
    article_categories: null,
    collection_content_types: null,
};

const FeedWidget: FC<WidgetProps> = ({ isLast }) => {
    const { user } = useSession();
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const [localFilters, setLocalFilters] =
        useState<FeedSubTypeFilters>(EMPTY_FILTERS);

    const feedSettings = preferences.feed;
    const onlyFollowed = feedSettings.only_followed ?? false;

    const filters = user
        ? {
              feed_content_types: feedSettings.feed_content_types ?? null,
              comment_content_types: feedSettings.comment_content_types ?? null,
              article_content_types: feedSettings.article_content_types ?? null,
              article_categories: feedSettings.article_categories ?? null,
              collection_content_types:
                  feedSettings.collection_content_types ?? null,
          }
        : localFilters;

    const handleOnlyFollowedChange = (value: boolean | 'indeterminate') => {
        update({ preferences: { feed: { only_followed: Boolean(value) } } });
    };

    const handleFiltersChange = (next: FeedSubTypeFilters) => {
        if (user) {
            update({ preferences: { feed: next } });
        } else {
            setLocalFilters(next);
        }
    };

    const feedArgs = useMemo((): FeedArgs => {
        const args: FeedArgs = {};

        if (onlyFollowed) args.only_followed = true;

        if (filters.feed_content_types !== null)
            args.feed_content_types =
                filters.feed_content_types as FeedArgs['feed_content_types'];
        if (filters.comment_content_types?.length)
            args.comment_content_types =
                filters.comment_content_types as FeedArgs['comment_content_types'];
        if (filters.article_content_types?.length)
            args.article_content_types =
                filters.article_content_types as FeedArgs['article_content_types'];
        if (filters.article_categories?.length)
            args.article_categories =
                filters.article_categories as FeedArgs['article_categories'];
        if (filters.collection_content_types?.length)
            args.collection_content_types =
                filters.collection_content_types as FeedArgs['collection_content_types'];

        return args;
    }, [onlyFollowed, filters]);

    const { ref: feedRef, inView } = useInView();

    const feedQuery = useInfiniteQuery({
        ...getFeedInfiniteOptions({ body: feedArgs }),
        ...feedPageParam(),
    });
    const {
        data: feedData,
        isPending,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = feedQuery;

    const feedList: FeedItemResponse[] | undefined = feedData?.pages.flat(1);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <Card className="gap-0 bg-secondary/20 p-0" id="feed-widget">
            <div className="flex flex-col gap-4 p-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Стрічка</HeaderTitle>
                    </HeaderContainer>
                    {user && (
                        <FieldLabel className="w-fit! cursor-pointer">
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={onlyFollowed}
                                    onCheckedChange={handleOnlyFollowedChange}
                                    id="only-followed-checkbox"
                                    name="only-followed-checkbox"
                                />
                                <FieldContent className="flex-0">
                                    <FieldTitle>Власна</FieldTitle>
                                </FieldContent>
                            </Field>
                        </FieldLabel>
                    )}
                    <FeedSubTypeSelect
                        value={filters}
                        onChange={handleFiltersChange}
                    />
                </Header>

                <FeedQuickFilters
                    value={filters}
                    onChange={handleFiltersChange}
                />
            </div>

            <div className="flex flex-col divide-y divide-border border-border border-t">
                {isPending
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <FeedItemSkeleton key={i} />
                      ))
                    : feedList?.map((item) => (
                          <FeedItem key={getFeedItemKey(item)} item={item} />
                      ))}

                {!isPending && feedList?.length === 0 && (
                    <div className="p-4">
                        <EmptyState
                            icon={<MaterialSymbolsDynamicFeedRounded />}
                            title="Стрічка порожня"
                            description={
                                onlyFollowed
                                    ? 'У вашій персональній стрічці поки немає записів. Підпишіться на інших користувачів, щоб бачити їхню активність.'
                                    : 'Наразі тут немає записів. Спробуйте змінити фільтри або повернутися пізніше.'
                            }
                        />
                    </div>
                )}

                {hasNextPage && (
                    <div className="p-4">
                        <LoadMoreButton
                            className="w-full"
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={isLast !== false ? feedRef : undefined}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FeedWidget;
