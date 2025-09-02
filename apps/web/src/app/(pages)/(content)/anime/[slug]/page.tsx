import { ContentTypeEnum } from '@hikka/client';
import { getQueryClient } from '@hikka/react/core';
import {
    prefetchAnimeBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { FC } from 'react';

import {
    AnimeActions as Actions,
    AnimeCharacters as Characters,
    AnimeCover as Cover,
    AnimeDescription as Description,
    AnimeDetails as Details,
    AnimeLinks as Links,
    AnimeMedia as Media,
    AnimeStaff as Staff,
    AnimeTitle as Title,
    AnimeWatchStats as WatchStats,
} from '@/features/anime';
import { ContentArticles } from '@/features/articles';
import { CommentList as Comments } from '@/features/comments';
import { Franchise } from '@/features/franchise';
import { Followings } from '@/features/modals';

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

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({
        slug,
        clientConfig,
        queryClient,
    });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.ANIME,
        },
        clientConfig,
        queryClient,
    });

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16">
            {anime && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonSchema({ anime })),
                    }}
                />
            )}
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
                <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <Actions />
                </div>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title />
                <Description />
                <Details className="lg:hidden" />
                <Characters />
                <Franchise content_type={ContentTypeEnum.ANIME} />
                <Media />
                <Staff />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details className="hidden lg:flex" />
                <WatchStats />
                <Followings content_type={ContentTypeEnum.ANIME} />
                <ContentArticles content_type={ContentTypeEnum.ANIME} />
                <Links />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2 lg:col-start-2">
                <Comments
                    preview
                    slug={slug}
                    content_type={ContentTypeEnum.ANIME}
                />
            </div>
        </div>
    );
};

export default AnimePage;
