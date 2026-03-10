import { collectionByReferenceOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

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
    head: ({ loaderData }) => ({
        meta: [
            {
                title: loaderData?.collection?.title
                    ? `${loaderData.collection.title} / Колекції / Hikka`
                    : 'Колекції / Hikka',
            },
        ],
    }),
    component: CollectionReferenceLayout,
});

function CollectionReferenceLayout() {
    return <Outlet />;
}
