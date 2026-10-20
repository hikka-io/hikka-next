import { Stack } from 'expo-router';

import { CatalogList, CatalogToolbar } from '@/features/catalog';

export default function CatalogScreen() {
    return (
        <>
            <Stack.Title large>Каталог</Stack.Title>
            <CatalogToolbar />
            <CatalogList />
        </>
    );
}
