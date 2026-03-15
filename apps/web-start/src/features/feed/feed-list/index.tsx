'use client';

import {
    ContentTypeEnum,
    FeedContentType,
    FeedItemResponse,
} from '@hikka/client';
import { useFeed } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { useFilterSearch } from '@/features/filters';

import { FeedSearch } from '@/utils/search-schemas';

import { FeedFilterEnum } from '../types';
import FeedItem from './components/feed-item';
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

const FEED_ITEM_HEIGHT_ESTIMATE = 300;

const FeedList = () => {
    const search = useFilterSearch<FeedSearch>();
    const router = useRouter();
    const listRef = useRef<HTMLDivElement>(null);

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
        } as any);
    };

    const { list: feedList, ref: feedRef } = useFeed({
        args: { content_type: contentType },
        options: { authProtected: true },
    });

    const itemCount = feedList?.length ?? 0;

    const rowVirtualizer = useWindowVirtualizer({
        count: itemCount,
        estimateSize: () => FEED_ITEM_HEIGHT_ESTIMATE,
        overscan: 3,
        scrollMargin: listRef.current?.offsetTop ?? 0,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    const paddingTop =
        virtualItems.length > 0
            ? virtualItems[0].start -
              (rowVirtualizer.options.scrollMargin ?? 0)
            : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? rowVirtualizer.getTotalSize() -
              virtualItems[virtualItems.length - 1].end
            : 0;

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={handleFilterChange} />

            <div
                ref={listRef}
                className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:mx-0 md:border-x overflow-hidden"
            >
                {paddingTop > 0 && <div style={{ height: paddingTop }} />}
                {virtualItems.map((virtualItem) => {
                    const item = feedList![virtualItem.index];

                    return (
                        <div
                            key={getFeedItemKey(item)}
                            ref={rowVirtualizer.measureElement}
                            data-index={virtualItem.index}
                        >
                            <FeedItem
                                item={item}
                                showTypeLabel={showTypeLabel}
                            />
                        </div>
                    );
                })}
                {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
            </div>

            <div ref={feedRef} />
        </div>
    );
};

export default FeedList;
