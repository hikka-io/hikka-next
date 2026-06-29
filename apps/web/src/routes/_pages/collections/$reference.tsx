import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getCollectionOptions } from '@hikka/api';

import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export const Route = createFileRoute('/_pages/collections/$reference')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { reference } = params;

        const collection = await queryClient.ensureQueryData(
            getCollectionOptions({ path: { reference }, client: apiClient }),
        );

        if (!collection) throw redirect({ to: '/collections' });

        return { collection };
    },
    head: ({ loaderData }) => {
        const collection = loaderData?.collection;
        if (!collection) return generateHeadMeta({ title: 'Колекції' });

        return generateHeadMeta({
            title: `${collection.title} / Колекції`,
            description: collection.description
                ? truncateText(collection.description, 150, true)
                : undefined,
            url: `https://hikka.io/collections/${collection.reference}`,
        });
    },
    component: CollectionReferenceLayout,
});

function CollectionReferenceLayout() {
    return <Outlet />;
}
