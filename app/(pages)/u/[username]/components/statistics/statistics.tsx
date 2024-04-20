import React from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import ActivityStats from './_components/activity-stats/activity-stats';
import WatchhourStats from './_components/watchhour-stats';

const Component = () => {
    return (
        <Block>
            <Header title={`Статистика`} />
            <Block className="md:flex-row">
                <ActivityStats />
                <WatchhourStats />
            </Block>
        </Block>
    );
};

export default Component;
