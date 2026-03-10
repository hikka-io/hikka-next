import { collectionByReferenceOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference')({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { reference } = params;

        const collection = await queryClient.ensureQueryData(
            collectionByReferenceOptions(hikkaClient, { reference }),
        );

        if (!collection) throw redirect({ to: '/collections' });

        return { collection };
    },
    head: ({ loaderData }) => {
        const collection = loaderData?.collection;
        if (!collection) return { meta: [{ title: 'Колекції / Hikka' }] };

        return generateHeadMeta({
            title: `${collection.title} / Колекції`,
        });
    },
    component: CollectionReferenceLayout,
});

function CollectionReferenceLayout() {
    return <Outlet />;
}
