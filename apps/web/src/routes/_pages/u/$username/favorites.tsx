import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { UserFavorites as Favorites } from '@/features/users';
import { generateHeadMeta } from '@/utils/metadata';

const favoritesSearchSchema = z.object({
    type: z
        .enum(['anime', 'manga', 'novel', 'character', 'collection'])
        .optional()
        .catch(undefined),
});

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
            <Favorites extended type={type} />
        </div>
    );
}
