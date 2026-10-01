import { createFileRoute } from '@tanstack/react-router';

import { userReferenceOptions } from '@hikka/api';

import { AboutPage } from '@/features/about';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { generateHeadMeta } from '@/utils/metadata';
import { ABOUT_CONTENT } from '@/utils/constants/about-data';

export const Route = createFileRoute('/_pages/about')({
    loader: async ({ context: { queryClient, apiClient } }) => {
        const references = [
            ...ABOUT_CONTENT.team.map((member) => member.reference),
            ...ABOUT_CONTENT.thanks,
        ];
        const entries = await Promise.all(
            references.map(
                async (reference) =>
                    [
                        reference,
                        await queryClient.ensureQueryData(
                            userReferenceOptions({
                                path: { reference },
                                client: apiClient,
                            }),
                        ),
                    ] as const,
            ),
        );

        return { profiles: Object.fromEntries(entries) };
    },
    head: () =>
        generateHeadMeta({
            title: 'Про нас',
            description:
                'Про Хікку, команду української онлайн-енциклопедії аніме, манґи та ранобе, і людей, які допомагають проєкту.',
            url: 'https://hikka.io/about',
        }),
    component: AboutRoute,
});

function AboutRoute() {
    const { profiles } = Route.useLoaderData();
    const titleAnchor = usePageTitleAnchor();

    usePageHeader({ title: 'Про нас', parent: '/', anchored: true });

    return <AboutPage profiles={profiles} titleAnchor={titleAnchor} />;
}
