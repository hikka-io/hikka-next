import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { getCollectionOptions, UserRoleEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';
import type { CollectionState } from '@/services/stores/collection-store';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
    beforeLoad: async ({ params, context: { queryClient, apiClient } }) => {
        const session = requireAuth(queryClient);

        // beforeLoad runs before the parent loader, so the cache may be empty
        const collection = await retryOnCancel(() =>
            queryClient.ensureQueryData(
                getCollectionOptions({
                    path: { reference: params.reference },
                    client: apiClient,
                }),
            ),
        ).catch(() => undefined);

        const isPrivileged =
            session.role === UserRoleEnum.ADMIN ||
            session.role === UserRoleEnum.MODERATOR;

        if (!collection?.my_role && !isPrivileged) {
            throw redirect({ to: `/collections/${params.reference}` });
        }
    },
    head: () =>
        generateHeadMeta({
            title: 'Редагувати колекцію',
            robots: { index: false },
        }),
    component: CollectionUpdatePage,
});

function CollectionUpdatePage() {
    const { reference } = Route.useParams();
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    usePageHeader({
        title: collection?.title,
        subtitle: 'Редагування',
        parent: `/collections/${reference}`,
    });

    if (!collection) return null;

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-x-10">
                    <Block>
                        <CollectionTitle />
                        <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:hidden">
                            <CollectionSettings mode="edit" />
                        </Card>
                        <CollectionGroups mode="edit" />
                    </Block>
                    <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                        <CollectionSettings mode="edit" />
                    </Card>
                </div>
            </div>
        </CollectionProvider>
    );
}
