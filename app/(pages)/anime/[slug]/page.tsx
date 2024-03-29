import React from 'react';

import About from './components/about';
import Characters from './components/characters';
import Description from './components/description';
import Franchise from './components/franchise';
import Links from './components/links';
import Media from './components/media';
import Staff from './components/staff';
import WatchStats from './components/watch-stats/watch-stats';

const AnimePage = () => {
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
                    <WatchStats />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <About />
                <div className="hidden flex-1 lg:block">
                    <WatchStats />
                </div>
            </div>
        </div>
    );
};

export default AnimePage;
