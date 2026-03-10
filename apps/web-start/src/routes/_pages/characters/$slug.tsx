import { ContentTypeEnum } from '@hikka/client';
import { ensureInfiniteQueryData } from '@hikka/react/core';
import {
    characterAnimeOptions,
    characterBySlugOptions,
    characterMangaOptions,
    characterNovelOptions,
    characterVoicesOptions,
    favouriteStatusOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { CHARACTER_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const character = await queryClient.ensureQueryData(
            characterBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!character) throw redirect({ to: '/' });

        await Promise.all([
            ensureInfiniteQueryData(
                queryClient,
                characterAnimeOptions(hikkaClient, { slug: params.slug }),
            ),
            ensureInfiniteQueryData(
                queryClient,
                characterMangaOptions(hikkaClient, { slug: params.slug }),
            ),
            ensureInfiniteQueryData(
                queryClient,
                characterNovelOptions(hikkaClient, { slug: params.slug }),
            ),
            ensureInfiniteQueryData(
                queryClient,
                characterVoicesOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.prefetchQuery(
                favouriteStatusOptions(hikkaClient, {
                    slug: params.slug,
                    contentType: ContentTypeEnum.CHARACTER,
                }),
            ),
        ]);

        return { character };
    },
    head: ({ loaderData }) => {
        const character = loaderData?.character;
        if (!character) return {};

        const title =
            character.name_ua || character.name_en || character.name_ja || '';

        return generateHeadMeta({
            title: { default: title, template: `%s / ${title} / Hikka` },
            description: character.description_ua,
            image: character.image,
        });
    },
    component: CharacterDetailLayout,
});

function CharacterDetailLayout() {
    const { character } = Route.useLoaderData();

    return (
        <ContentDetailLayout
            slug={character.slug}
            contentType={ContentTypeEnum.CHARACTER}
            navRoutes={CHARACTER_NAV_ROUTES}
            urlPrefix="/characters"
            title={
                character.name_ua ||
                character.name_en ||
                character.name_ja ||
                ''
            }
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
