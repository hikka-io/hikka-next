import { createFileRoute } from '@tanstack/react-router';

import { UserFavorites as Favorites } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/u/$username/favorites')({
    head: ({ params }) =>
        generateHeadMeta({ title: `Улюблене / ${params.username}` }),
    component: FavoritesPage,
});

function FavoritesPage() {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
}
