import { createFileRoute } from '@tanstack/react-router';

import { getCollectionOptions } from '@hikka/api';

import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/collections/$reference')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { reference } = params;

        const collection = await ensureOr404(() =>
            queryClient.ensureQueryData(
                getCollectionOptions({
                    path: { reference },
                    client: apiClient,
                }),
            ),
        );

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
            url: `${SITE_ORIGIN}/collections/${collection.reference}`,
        });
    },
});
