import { ContentTypeEnum } from '@hikka/client';
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

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                characterAnimeOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                characterMangaOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                characterNovelOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                characterVoicesOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
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
            title,
            description: character.description_ua,
            image: character.image,
            url: `https://hikka.io/characters/${character.slug}`,
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
