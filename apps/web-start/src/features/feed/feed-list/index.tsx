'use client';

import {
    ContentTypeEnum,
    FeedContentType,
    FeedItemResponse,
} from '@hikka/client';
import { useFeed } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';

import { useFilterSearch } from '@/features/filters';

import { FeedSearch } from '@/utils/search-schemas';

import { FeedFilterEnum } from '../types';
import FeedItem from './components/feed-item';
import FeedItemSkeleton from './components/feed-item-skeleton';
import FeedTabs from './components/feed-tabs';

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

const FeedList = () => {
    const search = useFilterSearch<FeedSearch>();
    const router = useRouter();

    const filter = (search.type as FeedFilterEnum) || FeedFilterEnum.ALL;
    const showTypeLabel = filter === FeedFilterEnum.ALL;
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
            resetScroll: false,
        });
    };

    const {
        list: feedList,
        ref: feedRef,
        isPending,
    } = useFeed({
        args: { content_type: contentType },
        options: { authProtected: true },
    });

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={handleFilterChange} />

            <div className="-mx-4 flex flex-col overflow-hidden border-x-0 border-y md:mx-0 md:rounded-lg md:border-x">
                {isPending
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <FeedItemSkeleton key={i} />
                      ))
                    : feedList?.map((item) => (
                          <div
                              key={getFeedItemKey(item)}
                              style={{
                                  contentVisibility: 'auto',
                                  containIntrinsicSize: '0 300px',
                              }}
                          >
                              <FeedItem
                                  item={item}
                                  showTypeLabel={showTypeLabel}
                              />
                          </div>
                      ))}
            </div>

            <div ref={feedRef} />
        </div>
    );
};

export default FeedList;
