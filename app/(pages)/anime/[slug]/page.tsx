import React from 'react';

import About from '@/app/(pages)/anime/[slug]/_layout/About';
import Characters from '@/app/(pages)/anime/[slug]/_layout/Characters';
import Description from '@/app/(pages)/anime/[slug]/_layout/Description';
import Franchise from '@/app/(pages)/anime/[slug]/_layout/Franchise';
import Links from '@/app/(pages)/anime/[slug]/_layout/Links';
import Media from '@/app/(pages)/anime/[slug]/_layout/Media';
import Staff from '@/app/(pages)/anime/[slug]/_layout/Staff';
import WatchListStats from '@/app/(pages)/anime/[slug]/_layout/WatchListStats';

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
