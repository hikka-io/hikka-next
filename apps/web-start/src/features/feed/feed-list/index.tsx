'use client';

import { useMemo, useState } from 'react';

import { ContentTypeEnum } from '@hikka/client';

import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import {
    FeedDisplayItem,
    FeedFilterEnum,
    FeedHistoryGroup,
    FeedHistoryItem,
} from '../types';
import { useGlobalFeed } from '../useGlobalFeed';
import FeedItem from './components/feed-item';
import FeedItemHistoryGroup from './components/feed-item-history-group';
import FeedTabs from './components/feed-tabs';

function isHistoryGroup(item: FeedDisplayItem): item is FeedHistoryGroup {
    return 'type' in item && item.type === 'history-group';
}

const FeedList = () => {
    const [filter, setFilter] = useState<FeedFilterEnum>(FeedFilterEnum.ALL);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(),
    );
    const { feed } = useGlobalFeed();

    const handleFilterChange = (newFilter: FeedFilterEnum) => {
        setFilter(newFilter);
        setExpandedGroups(new Set());
    };

    const filteredItems = useMemo(() => {
        if (filter === FeedFilterEnum.ALL) {
            return feed;
        }

        const dataType = FEED_FILTER_OPTIONS[filter].data_type;
        return feed.filter((item) => item.data_type === dataType);
    }, [filter, feed]);

    const displayItems = useMemo<FeedDisplayItem[]>(() => {
        if (filter !== FeedFilterEnum.ALL) {
            return filteredItems;
        }

        const result: FeedDisplayItem[] = [];
        let i = 0;

        while (i < filteredItems.length) {
            if (filteredItems[i].data_type === ContentTypeEnum.HISTORY) {
                const historyRun: FeedHistoryItem[] = [];

                while (
                    i < filteredItems.length &&
                    filteredItems[i].data_type === ContentTypeEnum.HISTORY
                ) {
                    historyRun.push(filteredItems[i] as FeedHistoryItem);
                    i++;
                }

                if (historyRun.length === 1) {
                    result.push(historyRun[0]);
                } else {
                    result.push({
                        type: 'history-group',
                        firstItem: historyRun[0],
                        hiddenItems: historyRun.slice(1),
                    });
                }
            } else {
                result.push(filteredItems[i]);
                i++;
            }
        }

        return result;
    }, [filteredItems, filter]);

    const handleExpand = (groupKey: string) => {
        setExpandedGroups((prev) => new Set(prev).add(groupKey));
    };

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={handleFilterChange} />

            <div className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:mx-0 md:border-x overflow-hidden">
                {displayItems.map((item) => {
                    if (isHistoryGroup(item)) {
                        return (
                            <FeedItemHistoryGroup
                                key={item.firstItem.reference}
                                group={item}
                                expanded={expandedGroups.has(
                                    item.firstItem.reference,
                                )}
                                onExpand={() =>
                                    handleExpand(item.firstItem.reference)
                                }
                            />
                        );
                    }

                    return <FeedItem key={item.reference} item={item} />;
                })}
            </div>
        </div>
    );
};

export default FeedList;
