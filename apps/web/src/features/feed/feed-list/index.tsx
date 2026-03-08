'use client';

import { useMemo, useState } from 'react';

import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import { FeedFilterEnum } from '../types';
import { useGlobalFeed } from '../useGlobalFeed';
import FeedItem from './components/feed-item';
import FeedTabs from './components/feed-tabs';

const FeedList = () => {
    const [filter, setFilter] = useState<FeedFilterEnum>(FeedFilterEnum.ALL);
    const { feed } = useGlobalFeed();

    const filteredItems = useMemo(() => {
        if (filter === FeedFilterEnum.ALL) {
            return feed;
        }

        const dataType = FEED_FILTER_OPTIONS[filter].data_type;
        return feed.filter((item) => item.data_type === dataType);
    }, [filter, feed]);

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={setFilter} />

            <div className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:mx-0 md:border-x overflow-hidden">
                {filteredItems.map((item) => (
                    <FeedItem key={item.reference} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FeedList;
