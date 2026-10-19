import { Stack } from 'expo-router';

import AnimeList from '@/components/anime-list';

const CATALOG_ARGS = { sort: ['score:desc', 'scored_by:desc'] };

export default function CatalogScreen() {
    return (
        <>
            <Stack.Title large>Аніме</Stack.Title>
            <AnimeList args={CATALOG_ARGS} />
        </>
    );
}
