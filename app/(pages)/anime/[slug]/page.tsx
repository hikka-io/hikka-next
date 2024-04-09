import React from 'react';

import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/services/api/anime/getAnimeInfo';

import jsonSchema from './anime.schema';
import About from './components/about';
import Characters from './components/characters';
import Description from './components/description';
import Followings from './components/followings/followings';
import Franchise from './components/franchise';
import Links from './components/links';
import Media from './components/media';
import Staff from './components/staff';
import WatchStats from './components/watch-stats/watch-stats';

const AnimePage = async ({
    params,
}: {
    params: {
        slug: string;
    };
}) => {
    const anime: AnimeResponse = await getAnimeInfo({ slug: params.slug });
    const jsonLd = jsonSchema({ anime });

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_33%] lg:gap-16 xl:grid-cols-[1fr_30%]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="relative order-2 flex flex-col gap-12 lg:order-1">
                <Description />
                <Characters />
                <Franchise />
                <Media />
                <Staff />
                <Links />
                <div className="flex flex-col gap-12 lg:hidden">
                    <WatchStats />
                    <Followings />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <About />
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                    <WatchStats />
                    <Followings />
                </div>
            </div>
        </div>
    );
};

export default AnimePage;
