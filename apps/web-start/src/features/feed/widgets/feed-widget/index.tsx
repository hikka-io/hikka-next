'use client';

import {
    ContentTypeEnum,
    FeedArgs,
    FeedContentType,
    FeedItemResponse,
} from '@hikka/client';
import { useFeed } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { FC, useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { useFilterSearch } from '@/features/filters';

import { useSettingsStore } from '@/services/stores/settings-store';
import { FeedSearch } from '@/utils/search-schemas';

import { WidgetProps } from '../../constants';
import { FeedFilterEnum } from '../../types';
import FeedItem from './components/feed-item';
import FeedItemSkeleton from './components/feed-item-skeleton';
import FeedSubTypeSelect from './components/feed-sub-type-select';

const FILTER_TO_CONTENT_TYPE: Partial<Record<FeedFilterEnum, FeedContentType>> =
    {
        [FeedFilterEnum.COMMENTS]: ContentTypeEnum.COMMENT,
        [FeedFilterEnum.ARTICLES]: ContentTypeEnum.ARTICLE,
        [FeedFilterEnum.COLLECTIONS]: ContentTypeEnum.COLLECTION,
    };

function getFeedItemKey(item: FeedItemResponse): string {
    if (item.data_type === ContentTypeEnum.ARTICLE) return item.slug;
    return item.reference;
}

const FeedWidget: FC<WidgetProps> = () => {
    const search = useFilterSearch<FeedSearch>();
    const router = useRouter();
    const { preferences } = useSettingsStore();
    const [onlyFollowed, setOnlyFollowed] = useState(false);

    const filter = (search.type as FeedFilterEnum) || FeedFilterEnum.ALL;
    const showTypeLabel = filter === FeedFilterEnum.ALL;

    const commentTypes = preferences.filters.feedCommentContentTypes || [];
    const articleTypes = preferences.filters.feedArticleContentTypes || [];
    const articleCategories = preferences.filters.feedArticleCategories || [];
    const collectionTypes =
        preferences.filters.feedCollectionContentTypes || [];

    const feedArgs = useMemo((): FeedArgs => {
        const args: FeedArgs = {};

        if (filter !== FeedFilterEnum.ALL) {
            args.content_type = FILTER_TO_CONTENT_TYPE[filter];
        }

        if (
            filter === FeedFilterEnum.ALL ||
            filter === FeedFilterEnum.COMMENTS
        ) {
            if (commentTypes.length)
                args.comment_content_types =
                    commentTypes as FeedArgs['comment_content_types'];
        }
        if (
            filter === FeedFilterEnum.ALL ||
            filter === FeedFilterEnum.ARTICLES
        ) {
            if (articleTypes.length)
                args.article_content_types =
                    articleTypes as FeedArgs['article_content_types'];
            if (articleCategories.length)
                args.article_categories =
                    articleCategories as FeedArgs['article_categories'];
        }
        if (
            filter === FeedFilterEnum.ALL ||
            filter === FeedFilterEnum.COLLECTIONS
        ) {
            if (collectionTypes.length)
                args.collection_content_types =
                    collectionTypes as FeedArgs['collection_content_types'];
        }

        return args;
    }, [
        filter,
        commentTypes,
        articleTypes,
        articleCategories,
        collectionTypes,
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
                                    onCheckedChange={(value) =>
                                        setOnlyFollowed(Boolean(value))
                                    }
                                    id="only-followed-checkbox"
                                    name="only-followed-checkbox"
                                />
                                <FieldContent className="flex-0">
                                    <FieldTitle>Власна</FieldTitle>
                                </FieldContent>
                            </Field>
                        </FieldLabel>
                        <FeedSubTypeSelect filter={filter} />
                    </div>
                </Header>
                {feedList && feedList?.length > 0 && (
                    <FeedItem
                        key={getFeedItemKey(feedList[0])}
                        item={feedList[0]}
                        showTypeLabel={showTypeLabel}
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
                              showTypeLabel={showTypeLabel}
                          />
                      ))}

            <div ref={feedRef} />
        </div>
    );
};

export default FeedWidget;
