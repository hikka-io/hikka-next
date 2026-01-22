import { ContentTypeEnum } from '@hikka/client';
import { getQueryClient } from '@hikka/react/core';
import {
    prefetchAnimeBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { FC } from 'react';

import { MovieBanner } from '@/features/anime';
import { ContentArticles } from '@/features/articles';
import { ContentCollections } from '@/features/collections';
import { CommentList as Comments } from '@/features/comments';
import {
    ContentActions as Actions,
    ContentCharacters as Characters,
    ContentCover as Cover,
    ContentDescription as Description,
    ContentDetails as Details,
    Franchise,
    ContentLinks as Links,
    ContentMedia as Media,
    ContentStaff as Staff,
    ContentStats as Stats,
    ContentTitle as Title,
} from '@/features/content';
import { Followings } from '@/features/modals';

import { getHikkaClientConfig } from '@/utils/hikka-client';

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
                <Cover content_type={ContentTypeEnum.ANIME} />
                <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <Actions content_type={ContentTypeEnum.ANIME} />
                </div>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title content_type={ContentTypeEnum.ANIME} />
                <Description content_type={ContentTypeEnum.ANIME} />
                <MovieBanner />
                <Details
                    className="lg:hidden"
                    content_type={ContentTypeEnum.ANIME}
                />
                <Characters content_type={ContentTypeEnum.ANIME} />
                <Franchise content_type={ContentTypeEnum.ANIME} />
                <Media />
                <Staff content_type={ContentTypeEnum.ANIME} />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details
                    className="hidden lg:flex"
                    content_type={ContentTypeEnum.ANIME}
                />
                <Stats content_type={ContentTypeEnum.ANIME} />
                <Followings content_type={ContentTypeEnum.ANIME} />
                <ContentArticles content_type={ContentTypeEnum.ANIME} />
                <ContentCollections content_type={ContentTypeEnum.ANIME} />
                <Links content_type={ContentTypeEnum.ANIME} />
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
