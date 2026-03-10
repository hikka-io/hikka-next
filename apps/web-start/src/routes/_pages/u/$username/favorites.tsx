import { createFileRoute } from '@tanstack/react-router';

import { UserFavorites as Favorites } from '@/features/users';

export const Route = createFileRoute('/_pages/u/$username/favorites')({
    head: () => ({
        meta: [{ title: 'Улюблене / Hikka' }],
    }),
    component: FavoritesPage,
});

function FavoritesPage() {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
}
