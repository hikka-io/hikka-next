'use client';

import { ContentTypeEnum, FeedArgs, FeedItemResponse } from '@hikka/client';
import { useFeed } from '@hikka/react';
import { FC, useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';

import { WidgetProps } from '../../constants';
import FeedItem from './components/feed-item';
import FeedItemSkeleton from './components/feed-item-skeleton';
import FeedSubTypeSelect from './components/feed-sub-type-select';

function getFeedItemKey(item: FeedItemResponse): string {
    if (item.data_type === ContentTypeEnum.ARTICLE) return item.slug;
    return item.reference;
}

const FeedWidget: FC<WidgetProps> = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const feedSettings = preferences.feed;
    const onlyFollowed = feedSettings.only_followed ?? false;

    const handleOnlyFollowedChange = (value: boolean | 'indeterminate') => {
        update({ preferences: { feed: { only_followed: Boolean(value) } } });
    };

    const feedArgs = useMemo((): FeedArgs => {
        const args: FeedArgs = {};

        if (onlyFollowed) args.only_followed = true;

        if (feedSettings.comment_content_types?.length)
            args.comment_content_types = feedSettings.comment_content_types;
        if (feedSettings.article_content_types?.length)
            args.article_content_types = feedSettings.article_content_types;
        if (feedSettings.article_categories?.length)
            args.article_categories = feedSettings.article_categories;
        if (feedSettings.collection_content_types?.length)
            args.collection_content_types =
                feedSettings.collection_content_types;

        return args;
    }, [
        onlyFollowed,
        feedSettings.comment_content_types,
        feedSettings.article_content_types,
        feedSettings.article_categories,
        feedSettings.collection_content_types,
    ]);

    const {
        list: feedList,
        ref: feedRef,
        isPending,
    } = useFeed({
        args: feedArgs,
        options: { authProtected: true },
    });

    return (
        <div className="flex flex-col overflow-hidden border-x-0 border-y -mx-4 md:mx-0 md:rounded-lg md:border-x">
            <div className="backdrop-blur-xl">
                <Header className="px-4 pt-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Стрічка</HeaderTitle>
                    </HeaderContainer>
                    <div className="flex gap-2">
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
                        <FeedSubTypeSelect />
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

            <div ref={feedRef} />
        </div>
    );
};

export default FeedWidget;
