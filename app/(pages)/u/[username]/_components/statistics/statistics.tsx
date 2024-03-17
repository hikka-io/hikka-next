import React from 'react';

import SubHeader from '@/components/sub-header';

import ActivityStats from './_components/activity-stats/activity-stats';
import WatchhourStats from './_components/watchhour-stats';

const Component = () => {
    return (
        <div className="flex flex-col gap-8">
            <SubHeader title={`Статистика`} />
            <div className="flex flex-col gap-8 md:flex-row">
                <ActivityStats />
                <WatchhourStats />
            </div>
        </div>
    );
};

export default Component;