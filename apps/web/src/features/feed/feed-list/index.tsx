'use client';

import { useMemo, useState } from 'react';

import { MOCK_FEED_DATA } from '../mock-data';
import { FEED_FILTER_OPTIONS } from '@/utils/constants/feed';

import { FeedFilterEnum } from '../types';
import FeedItem from './components/feed-item';
import FeedTabs from './components/feed-tabs';

const FeedList = () => {
    const [filter, setFilter] = useState<FeedFilterEnum>(FeedFilterEnum.ALL);

    const filteredItems = useMemo(() => {
        if (filter === FeedFilterEnum.ALL) {
            return MOCK_FEED_DATA;
        }

        const dataType = FEED_FILTER_OPTIONS[filter].data_type;
        return MOCK_FEED_DATA.filter((item) => item.data_type === dataType);
    }, [filter]);

    return (
        <div className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:-mx-0 md:border-x overflow-hidden">
            <FeedTabs value={filter} onChange={setFilter} />

            <div className="flex flex-col">
                {filteredItems.map((item) => (
                    <FeedItem key={item.reference} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FeedList;
