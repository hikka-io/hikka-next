import React from 'react';

import About from './_components/about';
import Characters from './_components/characters';
import Description from './_components/description';
import Franchise from './_components/franchise';
import Links from './_components/links';
import Media from './_components/media';
import Staff from './_components/staff';
import WatchListStats from './_components/actions/_components/watchlist-stats';

const Component = () => {
    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_33%] lg:gap-16 xl:grid-cols-[1fr_30%]">
            <div className="relative order-2 flex flex-col gap-12 lg:order-1">
                <Description />
                <Characters />
                <Franchise />
                <Media />
                <Staff />
                <Links />
                <div className="block lg:hidden">
                    <WatchListStats />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <About />
                <div className="hidden flex-1 lg:block">
                    <WatchListStats />
                </div>
            </div>
        </div>
    );
};

export default Component;
