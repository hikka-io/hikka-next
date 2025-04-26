import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchAnimeBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { FC } from 'react';

import Characters from '@/features/anime/anime-view/characters/characters.component';
import Description from '@/features/anime/anime-view/description.component';
import Details from '@/features/anime/anime-view/details/details.component';
import Links from '@/features/anime/anime-view/links/links.component';
import Media from '@/features/anime/anime-view/media/media.component';
import Staff from '@/features/anime/anime-view/staff.component';
import WatchStats from '@/features/anime/anime-view/watch-stats/watch-stats.component';
import ContentArticles from '@/features/articles/article-view/content-articles/content-articles';
import Followings from '@/features/followings/followings.component';
import Franchise from '@/features/franchise/franchise.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

import jsonSchema from './anime.schema';

interface Props {
    params: {
        slug: string;
    };
}

const AnimePage: FC<Props> = async (props) => {
    const params = await props.params;

    const { slug } = params;

    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({ slug, clientConfig });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.ANIME,
        },
        clientConfig,
    });

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_33%] lg:gap-16 xl:grid-cols-[1fr_30%]">
            {anime && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonSchema({ anime })),
                    }}
                />
            )}
            <div className="relative order-2 flex flex-col gap-12 lg:order-1">
                <Description />
                <Characters />
                <Franchise content_type={ContentTypeEnum.ANIME} />
                <Media />
                <Staff />
                <div className="flex flex-col gap-12 lg:hidden">
                    <WatchStats key="watch-stats" />
                    <Followings
                        content_type={ContentTypeEnum.ANIME}
                        key="followings"
                    />
                    <ContentArticles content_type={ContentTypeEnum.ANIME} />
                    <Links key="links" />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <Details />
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                    <WatchStats key="watch-stats" />
                    <Followings
                        content_type={ContentTypeEnum.ANIME}
                        key="followings"
                    />
                    <ContentArticles content_type={ContentTypeEnum.ANIME} />
                    <Links key="links" />
                </div>
            </div>
        </div>
    );
};

export default AnimePage;
