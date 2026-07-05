import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ContentDetailLayout } from '@/features/content';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { PERSON_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';
import { getTitle } from '@/utils/title/get-title';

export const Route = createFileRoute('/_pages/people/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const person = await ensureOr404(
            queryClient.ensureQueryData(
                personInfoOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
            ),
        );

        if (!person) throw notFound();

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData({
                ...personAnimeInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...personMangaInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...personNovelInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...personVoicesInfiniteOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        ]);

        return { person };
    },
    head: ({ loaderData }) => {
        const person = loaderData?.person;
        if (!person) return {};

        const title = getTitle(person) || '';

        return generateHeadMeta({
            title,
            description: person.description_ua,
            image: person.image,
            url: `https://hikka.io/people/${person.slug}`,
        });
    },
    component: PersonDetailLayout,
});

function PersonDetailLayout() {
    const { person } = Route.useLoaderData();
    const title = useTitle(person);

    return (
        <ContentDetailLayout
            slug={person.slug}
            contentType={ContentTypeEnum.PERSON}
            navRoutes={PERSON_NAV_ROUTES}
            urlPrefix="/people"
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
