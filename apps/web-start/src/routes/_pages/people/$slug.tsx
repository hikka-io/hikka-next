import { ContentTypeEnum } from '@hikka/client';
import {
    personAnimeOptions,
    personBySlugOptions,
    personCharactersOptions,
    personMangaOptions,
    personNovelOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ContentDetailLayout } from '@/features/content';

import { PERSON_NAV_ROUTES } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const person = await queryClient.ensureQueryData(
            personBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!person) throw redirect({ to: '/' });

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                personAnimeOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                personMangaOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                personNovelOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureInfiniteQueryData(
                personCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
        ]);

        return { person };
    },
    head: ({ loaderData }) => {
        const person = loaderData?.person;
        if (!person) return {};

        const title =
            person.name_ua || person.name_en || person.name_native || '';

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

    return (
        <ContentDetailLayout
            slug={person.slug}
            contentType={ContentTypeEnum.PERSON}
            navRoutes={PERSON_NAV_ROUTES}
            urlPrefix="/people"
            title={person.name_ua || person.name_en || person.name_native || ''}
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
