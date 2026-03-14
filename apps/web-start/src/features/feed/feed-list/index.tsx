'use client';

import {
    ContentTypeEnum,
    FeedContentType,
    FeedItemResponse,
} from '@hikka/client';
import { useFeed, useFollowingHistory, useSession } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';

import { useFilterSearch } from '@/features/filters';

import { FeedSearch } from '@/utils/search-schemas';

import { FeedFilterEnum } from '../types';
import FeedItem from './components/feed-item';
import FeedItemHeader from './components/feed-item-header';
import FeedItemHistory from './components/feed-item-history';
import FeedTabs from './components/feed-tabs';

const FILTER_TO_CONTENT_TYPE: Partial<
    Record<FeedFilterEnum, FeedContentType>
> = {
    [FeedFilterEnum.COMMENTS]: ContentTypeEnum.COMMENT,
    [FeedFilterEnum.ARTICLES]: ContentTypeEnum.ARTICLE,
    [FeedFilterEnum.COLLECTIONS]: ContentTypeEnum.COLLECTION,
};

function getFeedItemKey(item: FeedItemResponse): string {
    if (item.data_type === ContentTypeEnum.ARTICLE) return item.slug;
    return item.reference;
}

const FeedList = () => {
    const search = useFilterSearch<FeedSearch>();
    const router = useRouter();
    const { user } = useSession();

    const filter = (search.type as FeedFilterEnum) || FeedFilterEnum.ALL;
    const isActivity = filter === FeedFilterEnum.ACTIVITY;
    const contentType = FILTER_TO_CONTENT_TYPE[filter];

    const handleFilterChange = (value: FeedFilterEnum) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next = { ...prev };

                if (value === FeedFilterEnum.ALL) {
                    delete next.type;
                } else {
                    next.type = value;
                }

                return next;
            },
            replace: true,
        } as any);
    };

    const { list: feedList, ref: feedRef } = useFeed({
        args: { content_type: contentType },
        options: { enabled: !isActivity },
    });

    const { list: historyList, ref: historyRef } = useFollowingHistory({
        options: { enabled: isActivity && !!user },
    });

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={handleFilterChange} />

            <div className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:mx-0 md:border-x overflow-hidden">
                {isActivity
                    ? historyList?.map((item) => (
                          <div
                              key={item.reference}
                              className="flex flex-col isolate border-b last:border-b-0! first:backdrop-blur"
                          >
                              <FeedItemHeader
                                  author={item.user}
                                  dataType={ContentTypeEnum.HISTORY}
                                  created={item.created}
                              />
                              <div className="ml-14">
                                  <FeedItemHistory data={item} />
                              </div>
                          </div>
                      ))
                    : feedList?.map((item) => (
                          <FeedItem key={getFeedItemKey(item)} item={item} />
                      ))}
            </div>

            <div ref={isActivity ? historyRef : feedRef} />
        </div>
    );
};

export default FeedList;
