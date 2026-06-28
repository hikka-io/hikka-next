import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterInfoOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    getFavouriteOptions,
    HikkaApiError,
    paginationPageParam,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ContentDetailLayout } from '@/features/content';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants/navigation';
import { getAuthTokenFn } from '@/utils/cookies';
import { generateHeadMeta } from '@/utils/metadata';
import { getTitle } from '@/utils/title/get-title';

export const Route = createFileRoute('/_pages/characters/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const character = await queryClient
            .ensureQueryData(
                characterInfoOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
            )
            .catch((error) => {
                // An unknown slug returns 404 — render the not-found page
                // instead of letting the error bubble to the 500 component.
                if (error instanceof HikkaApiError && error.status === 404) {
                    throw notFound();
                }
                throw error;
            });

        if (!character) throw notFound();

        const prefetches: Promise<unknown>[] = [
            queryClient.ensureInfiniteQueryData({
                ...characterAnimeInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...characterMangaInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...characterNovelInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...characterVoicesInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        ];

        // Favourite status is user-specific; only prefetch when authenticated.
        if (await getAuthTokenFn()) {
            prefetches.push(
                queryClient.ensureQueryData(
                    getFavouriteOptions({
                        path: {
                            slug: params.slug,
                            content_type: ContentTypeEnum.CHARACTER,
                        },
                        client: apiClient,
                    }),
                ),
            );
        }

        await Promise.allSettled(prefetches);

        return { character };
    },
    head: ({ loaderData }) => {
        const character = loaderData?.character;
        if (!character) return {};

        const title = getTitle(character) || '';

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
    const title = useTitle(character);

    return (
        <ContentDetailLayout
            slug={character.slug}
            contentType={ContentTypeEnum.CHARACTER}
            navRoutes={CHARACTER_NAV_ROUTES}
            urlPrefix="/characters"
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
