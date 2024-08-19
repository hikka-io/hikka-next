import { FC } from 'react';

import Characters from '@/features/anime/anime-view/characters/characters.component';
import Description from '@/features/anime/anime-view/description.component';
import Details from '@/features/anime/anime-view/details/details.component';
import Followings from '@/features/anime/anime-view/followings/followings.component';
import Links from '@/features/anime/anime-view/links/links.component';
import Media from '@/features/anime/anime-view/media/media.component';
import Staff from '@/features/anime/anime-view/staff.component';
import WatchStats from '@/features/anime/anime-view/watch-stats/watch-stats.component';
import Franchise from '@/features/franchise/franchise.component';

import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/services/api/anime/getAnimeInfo';

import jsonSchema from './anime.schema';

interface Props {
    params: {
        slug: string;
    };
}

const AnimePage: FC<Props> = async ({ params }) => {
    const anime: AnimeResponse = await getAnimeInfo({
        params: {
            slug: params.slug,
        },
    });
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
                <Franchise content_type="anime" />
                <Media />
                <Staff />
                <div className="flex flex-col gap-12 lg:hidden">
                    <WatchStats />
                    <Followings />
                    <Links />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <Details />
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                    <WatchStats />
                    <Followings />
                    <Links />
                </div>
            </div>
        </div>
    );
};

export default AnimePage;
