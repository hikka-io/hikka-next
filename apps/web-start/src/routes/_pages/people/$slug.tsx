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

export const Route = createFileRoute('/_pages/people/$slug')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const person = await queryClient.ensureQueryData(
            personBySlugOptions(hikkaClient, { slug: params.slug }),
        );

        if (!person) throw redirect({ to: '/' });

        await Promise.all([
            queryClient.ensureQueryData(
                personAnimeOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                personMangaOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                personNovelOptions(hikkaClient, { slug: params.slug }),
            ),
            queryClient.ensureQueryData(
                personCharactersOptions(hikkaClient, { slug: params.slug }),
            ),
        ]);

        return { person };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title:
                    loaderData?.person?.name_ua ||
                    loaderData?.person?.name_en ||
                    loaderData?.person?.name_native ||
                    '',
            },
            {
                name: 'description',
                content: loaderData?.person?.description_ua || '',
            },
        ],
    }),
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
            title={
                person.name_ua || person.name_en || person.name_native || ''
            }
        >
            <Outlet />
        </ContentDetailLayout>
    );
}
