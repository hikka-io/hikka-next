'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useMemo, useState } from 'react';

import { MOCK_FEED_DATA } from '../mock-data';
import { FeedFilterEnum } from '../types';
import FeedItem from './components/feed-item';
import FeedTabs from './components/feed-tabs';

const FILTER_TO_DATA_TYPE: Partial<Record<FeedFilterEnum, ContentTypeEnum>> = {
    [FeedFilterEnum.COMMENTS]: ContentTypeEnum.COMMENT,
    [FeedFilterEnum.ARTICLES]: ContentTypeEnum.ARTICLE,
    [FeedFilterEnum.COLLECTIONS]: ContentTypeEnum.COLLECTION,
    [FeedFilterEnum.ACTIVITY]: ContentTypeEnum.HISTORY,
};

const FeedList = () => {
    const [filter, setFilter] = useState<FeedFilterEnum>(FeedFilterEnum.ALL);

    const filteredItems = useMemo(() => {
        if (filter === FeedFilterEnum.ALL) {
            return MOCK_FEED_DATA;
        }

        const dataType = FILTER_TO_DATA_TYPE[filter];
        return MOCK_FEED_DATA.filter((item) => item.data_type === dataType);
    }, [filter]);

    return (
        <div className="flex flex-col gap-4">
            <FeedTabs value={filter} onChange={setFilter} />
            <div className="flex flex-col border-y border-x-0 md:rounded-lg -mx-4 md:-mx-0 md:border-x overflow-hidden">
                {filteredItems.map((item) => (
                    <FeedItem key={item.reference} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FeedList;
