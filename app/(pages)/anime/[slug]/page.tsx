import React from 'react';

import About from '@/app/(pages)/anime/[slug]/_layout/about';
import Characters from '@/app/(pages)/anime/[slug]/_layout/characters';
import Description from '@/app/(pages)/anime/[slug]/_layout/description';
import Franchise from '@/app/(pages)/anime/[slug]/_layout/franchise';
import Links from '@/app/(pages)/anime/[slug]/_layout/links';
import Media from '@/app/(pages)/anime/[slug]/_layout/media';
import Staff from '@/app/(pages)/anime/[slug]/_layout/staff';
import WatchListStats from '@/app/(pages)/anime/[slug]/_layout/watchlist-stats';

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
