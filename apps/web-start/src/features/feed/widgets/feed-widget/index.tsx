'use client';

import {
    CollectionContentType,
    CommentsContentType,
    ContentTypeEnum,
    FeedArgs,
    FeedArticleCategory,
    FeedArticleContentType,
    FeedItemResponse,
} from '@hikka/client';
import { useFeed, useSession } from '@hikka/react';
import { FC, useMemo, useState } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';

import { WidgetProps } from '../../constants';
import FeedItem from './components/feed-item';
import FeedItemSkeleton from './components/feed-item-skeleton';
import FeedSubTypeSelect, {
    FeedSubTypeFilters,
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
            args.feed_content_types = filters.feed_content_types;
        if (filters.comment_content_types?.length)
            args.comment_content_types =
                filters.comment_content_types as CommentsContentType[];
        if (filters.article_content_types?.length)
            args.article_content_types =
                filters.article_content_types as FeedArticleContentType[];
        if (filters.article_categories?.length)
            args.article_categories =
                filters.article_categories as FeedArticleCategory[];
        if (filters.collection_content_types?.length)
            args.collection_content_types =
                filters.collection_content_types as CollectionContentType[];

        return args;
    }, [onlyFollowed, filters]);

    const {
        list: feedList,
        ref: feedRef,
        isPending,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useFeed({
        args: feedArgs,
    });

    return (
        <div className="-mx-4 flex flex-col overflow-hidden border-x-0 border-y md:mx-0 md:rounded-lg md:border-x">
            <div className="backdrop-blur-xl">
                <Header className="px-4 pt-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Стрічка</HeaderTitle>
                    </HeaderContainer>
                    <div className="flex gap-2">
                        {user && (
                            <FieldLabel className="w-fit! cursor-pointer">
                                <Field orientation="horizontal">
                                    <Checkbox
                                        checked={onlyFollowed}
                                        onCheckedChange={
                                            handleOnlyFollowedChange
                                        }
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
                    </div>
                </Header>
                {feedList && feedList?.length > 0 && (
                    <FeedItem
                        key={getFeedItemKey(feedList[0])}
                        item={feedList[0]}
                        showTypeLabel
                    />
                )}
            </div>

            {isPending
                ? Array.from({ length: 3 }).map((_, i) => (
                      <FeedItemSkeleton key={i} />
                  ))
                : feedList
                      ?.slice(1)
                      ?.map((item) => (
                          <FeedItem
                              key={getFeedItemKey(item)}
                              item={item}
                              showTypeLabel
                          />
                      ))}

            {!isPending && feedList?.length === 0 && (
                <div className="p-4">
                    <NotFound
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
                <div className="flex w-full p-4">
                    <LoadMoreButton
                        className="flex-1"
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={isLast !== false ? feedRef : undefined}
                    />
                </div>
            )}
        </div>
    );
};

export default FeedWidget;
