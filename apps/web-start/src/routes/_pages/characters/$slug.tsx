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

export const Route = createFileRoute('/_pages/characters/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const character = await queryClient.ensureQueryData(
            characterBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!character) throw redirect({ to: '/' });

        await Promise.all([
            queryClient.ensureQueryData(
                characterAnimeOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                characterMangaOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                characterNovelOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
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
    head: ({ loaderData }) => ({
        meta: [
            {
                title:
                    loaderData?.character?.name_ua ||
                    loaderData?.character?.name_en ||
                    loaderData?.character?.name_ja ||
                    '',
            },
            {
                name: 'description',
                content: loaderData?.character?.description_ua || '',
            },
        ],
    }),
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
