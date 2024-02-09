import React from 'react';

import ActivationAlert from '@/app/(pages)/u/[username]/_components/activation-alert';

import Activity from './_components/activity/activity';
import Favorites from './_components/favorites';
import Statistics from './_components/statistics';

const Component = () => {
    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
            <div className="flex flex-col gap-12 lg:gap-16 order-2 lg:order-1">
                <ActivationAlert />
                <Statistics />
                <Favorites />
            </div>
            <Activity className="order-1 lg:order-2" />
        </div>
    );
};

export default Component;