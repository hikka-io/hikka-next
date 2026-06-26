import type { ComponentProps } from 'react';

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';
import { useTitle } from '@/utils/title/use-title';
import { getTitle } from '@/utils/title/get-title';

import { ContentDetailLayout } from '@/features/content';
import { PERSON_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const person = await queryClient.ensureQueryData(
            personInfoOptions({
                path: { slug: params.slug },
                client: apiClient,
            }),
        );

        if (!person) throw redirect({ to: '/' });

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
            // TODO(phase2): drop cast
            contentType={
                ContentTypeEnum.PERSON as ComponentProps<
                    typeof ContentDetailLayout
                >['contentType']
            }
            navRoutes={PERSON_NAV_ROUTES}
            urlPrefix="/people"
            title={title}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
