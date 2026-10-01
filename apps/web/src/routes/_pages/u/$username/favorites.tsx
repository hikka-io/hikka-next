import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum, serviceUserStatsOptions } from '@hikka/api';

import { UserFavorites } from '@/features/users';
import { userFavouritesOptions } from '@/features/users/queries';
import { awaitOnServer } from '@/utils/api/loader-prefetch';
import { generateHeadMeta } from '@/utils/metadata';
import { favoritesSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/u/$username/favorites')({
    validateSearch: zodValidator(favoritesSearchSchema),
    loaderDeps: ({ search }) => ({ type: search.type }),
    loader: async ({ params, deps, context: { queryClient, apiClient } }) => {
        const { username } = params;
        const stats = serviceUserStatsOptions({
            path: { username },
            client: apiClient,
        });
        const list = userFavouritesOptions(
            username,
            deps.type ?? ContentTypeEnum.ANIME,
            {},
            apiClient,
        );

        await awaitOnServer([
            queryClient.prefetchQuery(stats),
            queryClient.prefetchInfiniteQuery(list),
        ]);
    },
    head: ({ params }) =>
        generateHeadMeta({ title: `Улюблене / ${params.username}` }),
    component: FavoritesPage,
});

function FavoritesPage() {
    const { type } = Route.useSearch();

    return (
        <div className="flex flex-col gap-12">
            <UserFavorites extended type={type} />
        </div>
    );
}
