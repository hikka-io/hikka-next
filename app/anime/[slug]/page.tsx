import About from '@/app/anime/[slug]/_layout/About';
import Description from '@/app/anime/[slug]/_layout/Description';
import Links from '@/app/anime/[slug]/_layout/Links';
import Characters from '@/app/anime/[slug]/_layout/Characters';
import Franchise from '@/app/anime/[slug]/_layout/Franchise';
import Staff from '@/app/anime/[slug]/_layout/Staff';
import Media from '@/app/anime/[slug]/_layout/Media';
import Comments from '@/app/anime/[slug]/_layout/Comments';
import WatchListStats from '@/app/anime/[slug]/_layout/WatchListStats';
import React from 'react';

const Component = () => {
    return (
        <div className="grid lg:grid-cols-[1fr_30%] grid-cols-1 lg:gap-16 gap-12">
            <div className="relative flex flex-col gap-12 lg:order-1 order-2">
                <Description />
                <Characters />
                <Franchise />
                <Media />
                <Staff />
                <Links />
                <div className="lg:hidden block">
                    <WatchListStats />
                </div>
            </div>
            <div className="flex flex-col gap-12 lg:order-2 order-1">
                <About />
                <div className="flex-1 lg:block hidden">
                    <WatchListStats />
                </div>
            </div>
        </div>
    );
};

export default Component;
