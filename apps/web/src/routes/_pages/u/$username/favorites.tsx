import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { UserFavorites } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';
import { favoritesSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/u/$username/favorites')({
    validateSearch: zodValidator(favoritesSearchSchema),
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
